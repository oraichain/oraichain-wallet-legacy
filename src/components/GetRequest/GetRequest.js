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
import FormCard from "src/components/FormCard";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import ErrorText from "src/components/ErrorText";
import ArrowButton from "src/components/ArrowButton";
import Loading from "src/components/Loading";
import ButtonGroup from "src/components/ButtonGroup";
import BackButton from "src/components/BackButton";
import PreviewButton from "src/components/PreviewButton";
import styles from "./GetRequest.module.scss";

// const message = Cosmos.message;
const cx = cn.bind(styles);

const GetRequest = ({ user, showAlertBox }) => {
    const cosmos = window.cosmos;
    const [loading, setLoading] = useState(false);
    const [jsonSrc, setJsonSrc] = useState(null);

    const schema = yup.object().shape({
        requestId: yup.string().required("The Request id is required."),
    });

    const methods = useForm({
        defaultValues: {
            user: user.account,
        },
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState, getValues } = methods;

    const onSubmit = async (data) => {
        const requestId = data?.requestId?.trim();
        try {
            setLoading(true);
            const request = await fetch(`${cosmos.url}/airesult/fullreq/${requestId}`).then((res) => res.json());
            if (!_.isNil(request?.code)) {
                showAlertBox({
                    variant: "error",
                    message: "Current AI request is not found",
                });
                return;
            }
            let results = [];
            for (let i = 0; i < request.result.results.length; i++) {
                results.push(atob(request.result.results[i].result).replace(/\\/g, ""));
            }
            setJsonSrc({
                request,
                results,
            });
        } catch (err) {
            showAlertBox({
                variant: "error",
                message: "Unexpected error from the server: " + err,
            });
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MainLayout pageTitle="Get">
                <div className={cx("get-request")}>
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
                                                `${process.env.REACT_APP_ORAI_SCAN || "https://scan.orai.io"}/ai_requests/${
                                                    jsonSrc?.request?.ai_request?.request_id ?? ""
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
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center">
                                            <Label htmlFor="requestId">Request id:</Label>
                                        </div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <TextField variant="primary" type="text" name="requestId" id="requestId" />
                                            <ErrorMessage
                                                errors={formState.errors}
                                                name="requestId"
                                                render={({ message }) => (
                                                    <ErrorText className={cx("error-text")}>{message}</ErrorText>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12 col-lg-4 d-flex flex-row justify-content-start  justify-content-lg-end align-items-center"></div>
                                        <div className="col-12 col-lg-8 d-flex flex-row justify-content-start align-items-center">
                                            <ArrowButton type="submit">Get</ArrowButton>
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        )}
                    </FormCard>
                </div>
            </MainLayout>

            {loading && <Loading message="Getting..." />}
        </>
    );
};

GetRequest.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
GetRequest.defaultProps = {};

export default GetRequest;
