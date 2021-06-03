import React, { useState } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import ReactJson from "react-json-view";
import { getTxBodySend } from "src/utils";
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
import BackButton from "src/components/BackButton";
import PreviewButton from "src/components/PreviewButton";
import styles from "./SendTokens.module.scss";

// const message = Cosmos.message;
const cx = cn.bind(styles);

const SendTokens = ({ user, showAlertBox }) => {
    const cosmos = window.cosmos;
    const [openPin, setOpenPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);
    const [jsonSrc, setJsonSrc] = useState(null);

    const schema = yup.object().shape({
        to: yup.string().required("The To is required"),
        amount: yup.string().required("The Amount is required").isNumeric("The Amount must be a number"),
        fee: yup.string().required("The Tx Fee is required").isNumeric("The Tx Fee must be a number"),
    });

    const methods = useForm({
        defaultValues: {
            gas: 200000,
        },
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState, getValues } = methods;

    const onSubmit = (data) => {
        setFormData(data);
        setOpenPin(true);
    };

    const onChildKey = async (childKey) => {
        try {
            setLoading(true);
            const txBody = getTxBodySend(user, formData.to, formData.amount * 1000000 + "", formData.memo);
            const res =
                (await cosmos.submit(
                    childKey,
                    txBody,
                    "BROADCAST_MODE_BLOCK",
                    parseFloat(formData.fee) * 1000000,
                    parseFloat(formData.gas)
                )) || {};
            setLoading(false);
            setOpenPin(false);
            setJsonSrc(res?.tx_response ?? {});
            showAlertBox({
                variant: "success",
                duration: 1000,
                message: "Sent successfully",
                onHide: () => {
                    if (!_.isNil(window?.opener)) {
                        window.opener.postMessage(res?.tx_response, "*");
                        window.close();
                    }
                },
            });
        } catch (ex) {
            showAlertBox({
                variant: "error",
                message: ex.message,
            });
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
                <MainLayout pageTitle="Send">
                    <div className={cx("send-tokens")}>
                        <FormCard>
                            {jsonSrc ? (
                                <>
                                    <div className="d-flex flex-row justify-content-between align-items-center mb-4">
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
                                    </div>

                                    <div className="w-100 overflow-auto">
                                        <ReactJson
                                            theme="monokai"
                                            style={{ backgroundColor: "inherit" }}
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
                                                <Label>From:</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 text-left">
                                                <StaticText>{user.address}</StaticText>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                                <Label htmlFor="to">To:</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextField variant="primary" type="text" name="to" id="to" />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="to"
                                                    render={({ message }) => (
                                                        <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                                <Label htmlFor="amount">Amount (orai):</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextField variant="primary" type="text" name="amount" id="amount" />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="amount"
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
                                                <Label htmlFor="fee">Tx Fee (orai):</Label>
                                            </div>
                                            <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                                <TextField variant="primary" type="text" name="fee" id="fee" />
                                                <ErrorMessage
                                                    errors={formState.errors}
                                                    name="fee"
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
                                            <ArrowButton type="submit">Send</ArrowButton>
                                        </div>
                                    </form>
                                </FormProvider>
                            )}
                        </FormCard>
                    </div>
                </MainLayout>
            )}

            {loading && <Loading message="Sending..." />}
        </>
    );
};

SendTokens.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
SendTokens.defaultProps = {};

export default SendTokens;
