import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import cn from "classnames/bind";
import { FormProvider, useForm } from "react-hook-form";
import queryString from "query-string";
import _ from "lodash";
import Big from "big.js";
import {
    getTxBodySend,
    getTxBodyMultiSend,
    getTxBodyDelegate,
    getTxCreateValidator,
    getTxBodyUndelegate,
    getTxBodyMsgWithdrawDelegatorReward,
    getTxBodyMsgWithdrawValidatorCommission,
} from "src/utils";
import { selectUser } from "src/store/slices/userSlice";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import Pin from "src/components/Pin";
import TextField from "src/components/TextField";
import Button from "src/components/Button";
import Loading from "src/components/Loading";
import styles from "./Transaction.module.scss";

const cx = cn.bind(styles);

const Transaction = ({ user, showAlertBox }) => {
    const history = useHistory();
    const [openPin, setOpenPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const txJsonRef = useRef(null);
    const methods = useForm({
        defaultValue: {
            account: user.name,
        },
    });
    const { getValues } = methods;
    const queryStringParse = queryString.parse(history.location.search) || {};
    const payload = JSON.parse(queryStringParse.raw_message || "{}");
    const cosmos = window.cosmos;

    useEffect(() => {
        if (!openPin && !_.isNil(txJsonRef?.current)) {
            if (window.stdSignMsgByPayload) {
                const txBody = window.stdSignMsgByPayload;
                txJsonRef.current.innerHTML = JSON.stringify(txBody);
            } else if (payload && payload.value) {
                const cloneObj = JSON.parse(JSON.stringify(payload));
                if (_.get(cloneObj, "value.fee.amount") && cloneObj.value.fee.amount[0]) {
                    cloneObj.value.fee.amount[0] = new Big(cloneObj.value.fee.amount[0]).times(0.000001);
                }
                if (_.get(cloneObj, "value.msg.0.value.amount.0.amount")) {
                    const amountString = _.get(cloneObj, "value.msg.0.value.amount.0.amount");
                    _.set(cloneObj, "value.msg.0.value.amount.0.amount", new Big(amountString).times(0.000001));
                }
                if (_.get(cloneObj, "value.msg.0.value.amount.amount")) {
                    const amountString = _.get(cloneObj, "value.msg.0.value.amount.amount");
                    _.set(cloneObj, "value.msg.0.value.amount.amount", new Big(amountString).times(0.000001));
                }
                txJsonRef.current.innerHTML = JSON.stringify(cloneObj.value);
            }
        }
    }, [openPin, txJsonRef]);

    const deny = () => {
        if (!_.isNil(window?.opener)) {
            window.opener.postMessage("deny", "*");
            window.close();
        }
    };

    const allow = () => {
        setOpenPin(true);
    };

    const onChildKey = async (childKey) => {
        try {
            setLoading(true);
            // will allow return childKey from Pin
            const type = _.get(payload, "type");
            let txBody;
            const memo = _.get(payload, "value.memo") || "";
            switch (type) {
                case "cosmos-sdk/MsgDelegate": {
                    const amount = new Big(_.get(payload, "value.msg.0.value.amount.amount") || 0).toString();
                    const validator_address = _.get(payload, "value.msg.0.value.validator_address");
                    txBody = getTxBodyDelegate(user, validator_address, amount, memo);
                    break;
                }
                case "cosmos-sdk/MsgUndelegate": {
                    const amount = new Big(_.get(payload, "value.msg.0.value.amount.amount") || 0).toString();
                    const validator_address = _.get(payload, "value.msg.0.value.validator_address");
                    txBody = getTxBodyUndelegate(user, validator_address, amount, memo);
                    break;
                }
                case "cosmos-sdk/MsgCreateValidator": {
                    txBody = getTxCreateValidator(_.get(payload, "value.msg.0.value"));
                    break;
                }
                case "cosmos-sdk/MsgWithdrawDelegationReward": {
                    txBody = getTxBodyMsgWithdrawDelegatorReward(
                        user,
                        _.get(payload, "value.msg.0.value.validator_address")
                    );
                    break;
                }
                case "cosmos-sdk/MsgWithdrawValidatorCommission": {
                    txBody = getTxBodyMsgWithdrawValidatorCommission(
                        _.get(payload, "value.msg.0.value.validator_address")
                    );
                    break;
                }
                default: {
                    const msgs = _.get(payload, "value.msg");
                    if (msgs.length > 1) {
                        txBody = getTxBodyMultiSend(user, msgs, memo);
                    } else {
                        const amount = new Big(_.get(payload, "value.msg.0.value.amount.0.amount") || 0).toString();
                        const to = _.get(payload, "value.msg.0.value.to_address");
                        txBody = getTxBodySend(user, to, amount, memo);
                    }
                }
            }
            // higher gas limit
            const res = (await cosmos.submit(childKey, txBody, "BROADCAST_MODE_BLOCK")) || {};
            showAlertBox({
                variant: "success",
                message: "Sent successfully",
                onHide: () => {
                    if (!_.isNil(window.opener)) {
                        window.opener.postMessage(res.tx_response, "*");
                        window.close();
                    } else {
                        txJsonRef.current.innerText = res.tx_response.raw_log;
                    }
                }
            });
            setLoading(false);

        } catch (ex) {
            showAlertBox({
                variant: "error",
                message: ex.message,
            });
            setLoading(false);
        } finally {
            // setBlocking(false);
        }
    };

    return (
        <AuthLayout>
            <FormContainer>
                {openPin ? (
                    <Pin
                        pinType="tx"
                        onChildKey={onChildKey}
                        closePin={() => {
                            setOpenPin(false);
                        }}
                        encryptedMnemonics={getValues("password")}
                    />
                ) : (
                    <FormProvider {...methods}>
                        <form>
                            <FormTitle>Sign Transaction</FormTitle>
                            <TextField type="text" name="account" className="d-none" />
                            <TextField
                                type="password"
                                name="password"
                                className="d-none"
                                autoComplete="current-password"
                            />
                            <div className={cx("tx-json")} ref={txJsonRef}></div>

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
                )}

                {loading && <Loading message="Signing..." />}
            </FormContainer>
        </AuthLayout>
    );
};

Transaction.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
Transaction.defaultProps = {};

export default Transaction;
