import React, { useState } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import ReactJson from "react-json-view";
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
import TextArea from "src/components/TextArea";
import ButtonGroup from "src/components/ButtonGroup";
import BackButton from "src/components/BackButton";
import PreviewButton from "src/components/PreviewButton";
import { gasValues } from "src/consts/gasValues";
import styles from "./SetRequest.module.scss";

// const message = Cosmos.message;
const cx = cn.bind(styles);

const SetRequest = ({ user, updateRequestId, showAlertBox }) => {
    const cosmos = window.cosmos;
    const message = Cosmos.message;
    const [openPin, setOpenPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [jsonSrc, setJsonSrc] = useState(null);

    const schema = yup.object().shape({
        oscriptName: yup.string().required("The To is required."),
        description: yup.string().required("The Description is required"),
        validatorCount: yup
            .string()
            .required("The Validator count is required")
            .isNumeric("The Validator count must be a number"),
        input: yup.string().required("The Input is required").isJSON("The Input must be JSON"),
        output: yup.string().required("The Output is required").isJSON("The Output must be JSON"),
        fees: yup.string().required("Tx Fee is required").isNumeric("Tx Fee must be a number"),
        gas: yup
            .number()
            .min(gasValues.MIN, "The Gas must be at least " + gasValues.MIN + ".")
            .max(gasValues.MAX, "The Gas may not be greater than " + gasValues.MAX + "."),
    });

    const methods = useForm({
        defaultValues: {
            user: user.account,
            gas: 200000,
        },
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState, getValues } = methods;

    const onSubmit = async (data) => {
        const oscriptName = data?.oscriptName?.trim();
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
            oracle_script_name: formData.oscriptName,
            creator: bech32.fromWords(bech32.toWords(childKey.identifier)),
            validator_count: new Long(formData.validatorCount),
            fees: `${formData.fees}orai`,
            input: Buffer.from(formData.input),
            expected_output: Buffer.from(formData.output),
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
                parseFloat(formData.fees) * 1000000,
                parseFloat(formData.gas)
            );
            if (res.tx_response.code !== 0) {
                showAlertBox({
                    variant: "error",
                    message: res.tx_response.raw_log,
                });
                return;
            }

            setJsonSrc(res?.tx_response ?? {});
            const requestId = JSON.parse(res.tx_response.raw_log)[0].events[0].attributes[0].value;
            // txJsonRef.current.innerText = res.tx_response.raw_log + "\n" + "request id: " + requestId;
            // check if the broadcast message is successful or not
            updateRequestId({ requestId });
            if (!_.isNil(window?.opener)) {
                window.opener.postMessage(res.tx_response, "*");
                window.close();
            } else {
                // txJsonRef.current.innerText = res.tx_response.raw_log;
            }
        } catch (ex) {
            showAlertBox({
                variant: "error",
                message: ex.message,
            });
            return;
        } finally {
            setLoading(false);
            setOpenPin(false);
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
                            {jsonSrc ? (
                                <>
                                    <ButtonGroup>
                                        <BackButton
                                            onClick={() => {
                                                setJsonSrc(null);
                                            }}
                                        >
                                            Back
                                        </BackButton>

                                        <PreviewButton
                                            onClick={() => {
                                                window.open(
                                                    `${process.env.REACT_APP_ORAI_SCAN || "https://scan.orai.io"}/txs/${
                                                        jsonSrc?.txhash ?? ""
                                                    }`
                                                );
                                            }}
                                        >
                                            View on oraiscan
                                        </PreviewButton>
                                    </ButtonGroup>

                                    <div className="w-100 overflow-auto">
                                        <ReactJson
                                            theme="monokai"
                                            style={{ backgroundColor: "inherit", wordBreak: "break-all" }}
                                            src={jsonSrc}
                                        />
                                    </div>
                                </>
                            ) : (
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
                                                <Label htmlFor="oscriptName">Oracle Script Name:</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextField
                                                    variant="primary"
                                                    type="text"
                                                    name="oscriptName"
                                                    id="oscriptName"
                                                />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="oscriptName"
                                                    render={({ message }) => (
                                                        <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                                <Label htmlFor="description">Description:</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextField
                                                    variant="primary"
                                                    type="text"
                                                    name="description"
                                                    id="description"
                                                />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="description"
                                                    render={({ message }) => (
                                                        <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                                <Label htmlFor="validatorCount">Validator Count:</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextField
                                                    variant="primary"
                                                    type="number"
                                                    name="validatorCount"
                                                    id="validatorCount"
                                                    step="1"
                                                />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="validatorCount"
                                                    render={({ message }) => (
                                                        <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-start">
                                                <Label htmlFor="input">Input(JSON):</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextArea variant="primary" name="input" id="input" />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="input"
                                                    render={({ message }) => (
                                                        <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-start">
                                                <Label htmlFor="output">Output(JSON):</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextArea variant="primary" name="output" id="output" />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="output"
                                                    render={({ message }) => (
                                                        <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                    )}
                                                />
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
                                                <Label htmlFor="fees">Tx Fee (orai):</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextField
                                                    variant="primary"
                                                    type="number"
                                                    name="fees"
                                                    id="fees"
                                                    step="0.0000001"
                                                />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="fees"
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

                                        <div className="row">
                                            <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center"></div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <ArrowButton type="submit">Set</ArrowButton>
                                            </div>
                                        </div>
                                    </form>
                                </FormProvider>
                            )}
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
