import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import cn from "classnames/bind";
import { FormProvider, useForm } from "react-hook-form";
import ReactJson from "react-json-view";
import queryString from "query-string";
import _ from "lodash";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import Button from "src/components/Button";
import styles from "./ConfirmTransaction.module.scss";

const cx = cn.bind(styles);

const ConfirmTransaction = ({ user, showAlertBox }) => {
    const history = useHistory();
    const [jsonSrc, setJsonSrc] = useState(null);

    const methods = useForm({
        defaultValue: {
            account: user.name,
        },
    });
    const queryStringParse = queryString.parse(history.location.search) || {};
    const payload = JSON.parse(queryStringParse.raw_message || "{}");

    useEffect(() => {
        console.log(user.childKey);
        
        const cloneObj = JSON.parse(JSON.stringify(payload));
        setJsonSrc(cloneObj);
    }, []);

    const deny = () => {
        if (!_.isNil(window?.opener)) {
            window.opener.postMessage("deny", "*");
            window.close();
        }
    };

    const allow = () => {
        if (!_.isNil(window?.opener)) {
            window.opener.postMessage({
                childKey: user.childKey
            }, "*");
            window.close();
        }
    };

    return (
        <AuthLayout>
            <FormContainer>
                <FormProvider {...methods}>
                    <form>
                        <FormTitle>Confirm Transaction</FormTitle>
                        {/* <TextField type="text" name="account" className="d-none" />
                        <TextField
                            type="password"
                            name="password"
                            className="d-none"
                            autoComplete="current-password"
                        /> */}
                        <div className={cx("tx-json")}>
                            <ReactJson
                                theme="monokai"
                                style={{ backgroundColor: "inherit" }}
                                src={jsonSrc}
                            />
                        </div>

                        <div className="d-flex flex-row justify-content-center my-4">
                            <Button variant="primary" size="lg" onClick={allow}>
                                ALLOW
                            </Button>
                        </div>

                        <div className="d-flex flex-row justify-content-center mb-5">
                            <Button variant="secondary" size="lg" onClick={deny}>
                                DENY
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </FormContainer>
        </AuthLayout>
    );
};

ConfirmTransaction.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
ConfirmTransaction.defaultProps = {};

export default ConfirmTransaction;
