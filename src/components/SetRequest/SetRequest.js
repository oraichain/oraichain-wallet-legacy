import React, { useState, useRef } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import KSUID from "ksuid";
import Cosmos from "@oraichain/cosmosjs";
import bech32 from "bech32";
import Long from "long";
import MainLayout from "src/components/MainLayout";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormCard from "src/components/FormCard";
import Label from "src/components/Label";
import StaticText from "src/components/StaticText";
import TextField from "src/components/TextField";
import ErrorText from "src/components/ErrorText";
import ArrowButton from "src/components/ArrowButton";
import Pin from "src/components/Pin";
import Loading from "src/components/Loading";
import SliderInput from "src/components/SliderInput";
import styles from "./SetRequest.module.scss";
import TextArea from "../TextArea";

// const message = Cosmos.message;
const cx = cn.bind(styles);

const SetRequest = ({ user, updateRequestId, showAlertBox }) => {
    const cosmos = window.cosmos;
    const message = Cosmos.message;
    const [openPin, setOpenPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const txJsonRef = useRef(null);

    yup.addMethod(yup.string, "shouldBeJSON", function () {
        return this.test({
            name: "validate-json",
            exclusive: false,
            message: "Value must be JSON",
            test(value) {
                if (!_.isNil(value)) {
                    try {
                        let obj = JSON.parse(value);
                        if (obj && typeof obj === "object") {
                            return true;
                        }
                    } catch (error) {
                        return false;
                    }
                }
                return false;
            },
        });
    });

    const schema = yup.object().shape({
        oscript_name: yup.string().required("The To is required"),
        des: yup.string().required("Description field is required"),
        validator_count: yup
            .number()
            .required("The Validator count is required")
            .typeError("The Validator count must be a number"),
        input: yup.string().shouldBeJSON("shouldBeJSON"),
        expected_output: yup.string().shouldBeJSON("shouldBeJSON"),
    });

    const methods = useForm({
        defaultValues: {
            gas: 200000,
        },
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState, getValues } = methods;

    const onSubmit = async (data) => {
        const oscriptName = data?.oscript_name?.trim();
        try {
            const oscript = await fetch(`${cosmos.url}/provider/oscript/${oscriptName}`).then((res) => res.json());
            if (!_.isNil(oscript?.code)) {
                showAlertBox({
                    variant: "error",
                    message: "Current name of the oscript is not found",
                });
                return;
            }
            setFormData(data);
            setOpenPin(true);
        } catch (err) {
            showAlertBox({
                variant: "error",
                message: "Unexpected error from the server: " + err,
            });
            return;
        }
    };

    const getTxBody = (childKey) => {
        const msgSend = new message.oraichain.orai.airequest.MsgSetAIRequest({
            request_id: KSUID.randomSync().string,
            oracle_script_name: formData.oscript_name,
            creator: bech32.fromWords(bech32.toWords(childKey.identifier)),
            validator_count: new Long(formData.validator_count),
            fees: `${formData.request_fees}orai`,
            input: Buffer.from(formData.input),
            expected_output: Buffer.from(formData.expected_output),
        });

        const msgSendAny = new message.google.protobuf.Any({
            type_url: "/oraichain.orai.airequest.MsgSetAIRequest",
            value: message.oraichain.orai.airequest.MsgSetAIRequest.encode(msgSend).finish(),
        });

        return new message.cosmos.tx.v1beta1.TxBody({
            messages: [msgSendAny],
            memo: formData.memo,
        });
    };

    const onChildKey = async (childKey) => {
        try {
            setLoading(true);
            // will allow return childKey from Pin
            const txBody = getTxBody(childKey);
            // higher gas limit
            const res = await cosmos.submit(
                childKey,
                txBody,
                "BROADCAST_MODE_BLOCK",
                parseFloat(formData.request_fees) * 1000000,
                parseFloat(formData.gas)
            );
            if (res.tx_response.code !== 0) {
                showAlertBox({
                    variant: "error",
                    message: res.tx_response.raw_log,
                });
                return;
            }
            const requestId = JSON.parse(res.tx_response.raw_log)[0].events[0].attributes[0].value;
            txJsonRef.current.innerText = res.tx_response.raw_log + "\n" + "request id: " + requestId;
            // check if the broadcast message is successful or not
            updateRequestId({ requestId });
            if (!_.isNil(window?.opener)) {
                window.opener.postMessage(res.tx_response, "*");
                window.close();
            } else {
                txJsonRef.current.innerText = res.tx_response.raw_log;
            }
        } catch (ex) {
            showAlertBox({
                variant: "error",
                message: ex.message,
            });
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {openPin ? (
                <AuthLayout>
                    <FormContainer>
                        <Pin
                            pinType="tx"
                            onChildKey={onChildKey}
                            closePin={() => {
                                setOpenPin(false);
                            }}
                            encryptedMnemonics={getValues("password")}
                        />
                    </FormContainer>
                </AuthLayout>
            ) : (
                <MainLayout pageTitle="Set">
                    <div className={cx("set-request")}>
                        <FormCard>
                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <TextField type="text" name="account" className="d-none" />
                                    <TextField
                                        type="password"
                                        name="password"
                                        className="d-none"
                                        autoComplete="current-password"
                                    />

                                    <div className="row">
                                        <div className="col-12 col-lg-4 text-left text-lg-right">
                                            <Label>Creator:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 text-left">
                                            <StaticText>{user.address}</StaticText>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                            <Label htmlFor="oscript_name">Oracle Script Name:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <TextField
                                                variant="primary"
                                                type="text"
                                                name="oscript_name"
                                                id="oscript_name"
                                            />
                                            <ErrorMessage
                                                errors={formState.errors}
                                                name="oscript_name"
                                                render={({ message }) => (
                                                    <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                            <Label htmlFor="des">Description:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <TextField variant="primary" type="text" name="des" id="des" />
                                            <ErrorMessage
                                                errors={formState.errors}
                                                name="des"
                                                render={({ message }) => (
                                                    <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                            <Label htmlFor="validator_count">Validator Count:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <TextField
                                                variant="primary"
                                                type="text"
                                                name="validator_count"
                                                id="validator_count"
                                            />
                                            <ErrorMessage
                                                errors={formState.errors}
                                                name="validator_count"
                                                render={({ message }) => (
                                                    <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-start">
                                            <Label htmlFor="input">Input:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <TextArea variant="primary" name="input" id="input" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-start">
                                            <Label htmlFor="expected_output">Output:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <TextArea variant="primary" name="expected_output" id="expected_output" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                            <Label htmlFor="gas">Gas:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <SliderInput name="gas" id="gas" />
                                            <ErrorMessage
                                                errors={formState.errors}
                                                name="gas"
                                                render={({ message }) => (
                                                    <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                            <Label htmlFor="request_fees">Tx Fee (orai):</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <TextField
                                                variant="primary"
                                                type="text"
                                                name="request_fees"
                                                id="request_fees"
                                            />
                                            <ErrorMessage
                                                errors={formState.errors}
                                                name="request_fees"
                                                render={({ message }) => (
                                                    <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                            <Label htmlFor="memo">Memo:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <TextField variant="primary" type="text" name="memo" id="memo" />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <ArrowButton type="submit">Set</ArrowButton>
                                    </div>
                                </form>
                            </FormProvider>
                            <div className={cx("tx-json")} ref={txJsonRef}></div>
                        </FormCard>
                    </div>
                </MainLayout>
            )}

            {loading && <Loading message="Setting..." />}
        </>
    );
};

SetRequest.propTypes = {
    user: PropTypes.any,
    updateRequestId: PropTypes.func,
    showAlertBox: PropTypes.func,
};
SetRequest.defaultProps = {};

export default SetRequest;
