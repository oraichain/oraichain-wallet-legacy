import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import cn from "classnames/bind";
import { FormProvider, useForm } from "react-hook-form";
import queryString from "query-string";
import _ from "lodash";
import Big from "big.js";
import ReactJson from "react-json-view";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {
  getTxBodySend,
  getTxBodyMultiSend,
  getTxBodyDelegate,
  getTxCreateValidator,
  getTxBodyUndelegate,
  getTxBodyMsgWithdrawDelegatorReward,
  getTxBodyMsgWithdrawValidatorCommission,
  getTxBodyParameterChangeProposal,
  getTxBodyDepositProposal,
  getTxBodyVoteProposal,
  getTxBodyMsgExecuteContract,
  getMessageExecuteContract,
  getTxBody,
  getTxBodyReDelegate,
} from "src/utils";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import Pin from "src/components/Pin";
import TextField from "src/components/TextField";
import Button from "src/components/Button";
import Loading from "src/components/Loading";
import ButtonGroup from "src/components/ButtonGroup";
import PreviewButton from "src/components/PreviewButton";
import styles from "./Transaction.module.scss";
import { domainMessage } from "../../constants";

const cx = cn.bind(styles);

const Transaction = ({ user, showAlertBox }) => {
  const history = useHistory();
  const [openPin, setOpenPin] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isViewingJSON, setIsViewingJSON] = useState(false);
  const [jsonSrc, setJsonSrc] = useState(null);
  const [payload, setPayload] = useState({});
  const [payOnLoad, setPayOnLoad] = useState({});
  console.log(jsonSrc);
  const methods = useForm({
    defaultValue: {
      account: user.name,
    },
  });
  const { getValues } = methods;
  //   const queryStringParse = queryString.parse(history.location.search) || {};
  //   let payload = {};
  //   if (!_.isNil(queryStringParse?.raw_message)) {
  //     payload = JSON.parse(queryStringParse.raw_message);
  //   } else if (!_.isNil(queryStringParse?.payload)) {
  //     payload = JSON.parse(queryStringParse.payload);
  //   }
  //   console.log({ payload });

  const eventHandler = (event) => {
    const obj = event.data;
    if (!jsonSrc) {
      window.opener.postMessage({ data: "ready" }, "*");
    }
    // only check origin if network is mainnet
    console.log("window network event handler: ", window.network, window.lcd);

    if (
      window.network === "Oraichain" &&
      window.lcd === "https://lcd.orai.io" &&
      process.env.REACT_APP_ORAI_SCAN_WALLET === "https://api.wallet.orai.io"
    ) {
      const checkOrigin = domainMessage.find((dom) => dom === event.origin);
      if (!checkOrigin) return;
    }
    const queryStringParse = {
      payload: "{}",
      raw_message: "{}",
      ...obj,
    };
    let pay = {};
    if (!_.isNil(queryStringParse?.raw_message)) {
      pay = JSON.parse(queryStringParse.raw_message);
    } else if (!queryStringParse.payload) {
      pay = JSON.parse(queryStringParse.payload);
    }
    setPayload(pay);
  };

  useEffect(() => {
    window.addEventListener("message", eventHandler, false);
    return () => {
      window.removeEventListener("message", eventHandler);
    };
  });

  const cosmos = window.cosmos;
  const oraiwasm = window.oraiwasm;

  if (!showResult && !openPin && _.isNil(jsonSrc)) {
    if (window.stdSignMsgByPayload) {
      const txBody = window.stdSignMsgByPayload;
      setJsonSrc(txBody);
    } else if (payload && !_.isNil(payload.value)) {
      const cloneObj = JSON.parse(JSON.stringify(payload));
      // if (_.get(cloneObj, "value.fee.amount") && cloneObj.value.fee.amount[0]) {
      //   cloneObj.value.fee.amount[0] = new Big(
      //     cloneObj.value.fee.amount[0]
      //   ).toString();
      // }
      if (_.get(cloneObj, "value.msg.0.value.amount.0.amount")) {
        const amountString = _.get(
          cloneObj,
          "value.msg.0.value.amount.0.amount"
        );
        _.set(
          cloneObj,
          "value.msg.0.value.amount.0.amount",
          new Big(amountString).toString()
        );
      }
      if (_.get(cloneObj, "value.msg.0.value.amount.amount")) {
        const amountString = _.get(cloneObj, "value.msg.0.value.amount.amount");
        _.set(
          cloneObj,
          "value.msg.0.value.amount.amount",
          new Big(amountString).toString()
        );
      }
      setPayOnLoad(cloneObj);
      setJsonSrc(cloneObj.value);
    }
  }

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
    return;
    try {
      setLoading(true);
      // will allow return childKey from Pin
      let gasUsed = 0;
      const type = _.get(payOnLoad, "type");
      let txBody;
      let message;
      const memo = _.get(payOnLoad, "value.memo") || "";
      if (type.includes("MsgDelegate")) {
        const amount = new Big(
          _.get(payOnLoad, "value.msg.0.value.amount.amount") || 0
        ).toString();
        const validator_address = _.get(
          payOnLoad,
          "value.msg.0.value.validator_address"
        );
        txBody = getTxBodyDelegate(user, validator_address, amount, memo);
      } else if (type.includes("MsgUndelegate")) {
        const amount = new Big(
          _.get(payOnLoad, "value.msg.0.value.amount.amount") || 0
        ).toString();
        const validator_address = _.get(
          payOnLoad,
          "value.msg.0.value.validator_address"
        );
        txBody = getTxBodyUndelegate(user, validator_address, amount, memo);
      } else if (type.includes("MsgBeginRedelegate")) {
        const amount = new Big(
          _.get(payOnLoad, "value.msg.0.value.amount.amount") || 0
        ).toString();
        const validator_src_address = _.get(
          payOnLoad,
          "value.msg.0.value.validator_src_address"
        );
        const validator_dst_address = _.get(
          payOnLoad,
          "value.msg.0.value.validator_dst_address"
        );
        txBody = getTxBodyReDelegate(
          user,
          validator_src_address,
          validator_dst_address,
          amount,
          memo
        );
      } else if (type.includes("MsgCreateValidator")) {
        txBody = getTxCreateValidator(_.get(payOnLoad, "value.msg.0.value"));
      } else if (type.includes("MsgWithdrawDelegatorReward")) {
        txBody = getTxBodyMsgWithdrawDelegatorReward(
          user,
          // _.get(payload, "value.msg.0.value.validator_address")
          _.get(payOnLoad, "value.msg")
        );
      } else if (type.includes("MsgWithdrawValidatorCommission")) {
        txBody = getTxBodyMsgWithdrawValidatorCommission(
          _.get(payOnLoad, "value.msg.0.value.validator_address")
        );
      } else if (type.includes("MsgExecuteContract")) {
        const gasType = _.get(payOnLoad, "gasType");
        let msgs = _.get(payOnLoad, "value.msg");
        let messages = [];
        for (let msg of msgs) {
          messages.push(getMessageExecuteContract(msg.value));
        }

        // handle auto gas
        if (gasType === "auto") {
          let simulateMsgs = [];
          for (let msg of msgs) {
            simulateMsgs.push(
              oraiwasm.getHandleMessageSimulate(
                msg.value.contract,
                Buffer.from(msg.value.msg),
                msg.value.sender,
                null
              )
            );
          }
          try {
            const response = await oraiwasm.simulate(
              childKey.publicKey,
              oraiwasm.getTxBody(simulateMsgs, undefined, undefined)
            );
            console.log("simulate response: ", response);
            if (response && response.gas_info && response.gas_info.gas_used)
              gasUsed = Math.round(parseInt(response.gas_info.gas_used) * 1.2);
          } catch (ex) {
            // if cannot simulate => ignore, use default gas
            console.log("error simulating response: ", ex);
          }
        }
        txBody = getTxBody({ messages });
      } else if (type.includes("ParameterChangeProposal")) {
        txBody = getTxBodyParameterChangeProposal(
          _.get(payOnLoad, "value.msg.0.value"),
          childKey
        );
      } else if (type.includes("MsgDeposit")) {
        txBody = getTxBodyDepositProposal(_.get(payOnLoad, "value.msg.value"));
      } else if (type.includes("MsgVote")) {
        txBody = getTxBodyVoteProposal(_.get(payOnLoad, "value.msg.value"));
      } else if (type.includes("MsgMultiSend")) {
        const msgs = _.get(payOnLoad, "value.msg");
        txBody = getTxBodyMultiSend(user, msgs, memo);
      } else if (type.includes("MsgSend")) {
        const amount = new Big(
          _.get(payOnLoad, "value.msg.0.value.amount.0.amount") || 0
        ).toString();
        const to = _.get(payOnLoad, "value.msg.0.value.to_address");
        txBody = getTxBodySend(user, to, amount, memo);
      }
      let { amount, gas } = _.get(payOnLoad, "value.fee");
      console.log("fees: ", { amount, gas });
      console.log("amount: ", amount[0]);
      console.log("tx body: ", txBody);
      if (gasUsed !== 0) gas = gasUsed;

      // higher gas limit
      const res =
        (await cosmos.submit(
          childKey,
          txBody,
          "BROADCAST_MODE_BLOCK",
          isNaN(parseInt(amount[0])) ? 0 : amount[0],
          gas
        )) || {};
      showAlertBox({
        variant: "success",
        message: "Sent successfully",
        onHide: () => { },
      });

      if (!_.isNil(window.opener)) {
        window.opener.postMessage(
          { source: jsonSrc, res: res.tx_response },
          "*"
        );
        window.close();
      } else {
        setJsonSrc(res.tx_response);
        setShowResult(true);
      }

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

  const getEncryptedPassword = () => {
    const pw = getValues("password");
    if (!!pw) {
      return pw;
    }
    const storageKey = user.account + "-password";
    return localStorage.getItem(storageKey);
  };

  const toogleViewJSON = () => {
    setIsViewingJSON(!isViewingJSON);
  };

  return (
    <AuthLayout>
      {showResult ? (
        <>
          <FormTitle>Result of sign transaction</FormTitle>
          <div className="d-flex flex-row align-items-end mb-4">
            <PreviewButton
              onClick={() => {
                window.open(
                  `${process.env.REACT_APP_ORAI_SCAN || "https://scan.orai.io"
                  }/txs/${jsonSrc?.txhash ?? ""}`
                );
              }}
            >
              View on oraiscan
            </PreviewButton>
          </div>
          {jsonSrc && (
            <div className="w-100 overflow-auto">
              <ReactJson
                theme="monokai"
                style={{ backgroundColor: "inherit", wordBreak: "break-all" }}
                src={jsonSrc}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {openPin ? (
            <FormContainer>
              <Pin
                pinType="tx"
                onChildKey={onChildKey}
                closePin={() => {
                  setOpenPin(false);
                }}
                encryptedPassword={getEncryptedPassword()}
              />
            </FormContainer>
          ) : (
            <FormProvider {...methods}>
              <form>
                <FormTitle>Sign Transaction</FormTitle>
                <ButtonGroup className="my-3">
                  <Button variant="primary" size="lg" onClick={allow}>
                    ALLOW
                  </Button>

                  <Button variant="secondary" size="lg" onClick={deny}>
                    DENY
                  </Button>
                </ButtonGroup>

                <TextField type="text" name="account" className="d-none" />
                <TextField
                  type="password"
                  name="password"
                  className="d-none"
                  autoComplete="current-password"
                />

                {jsonSrc && (
                  <div className="w-100 overflow-auto">
                    <div className={cx("view-raw-tx")} onClick={toogleViewJSON}>
                      View raw transaction
                      {isViewingJSON ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowRightIcon />
                      )}
                    </div>
                    {isViewingJSON && (
                      <ReactJson
                        theme="monokai"
                        style={{
                          backgroundColor: "inherit",
                          wordBreak: "break-all",
                        }}
                        src={jsonSrc}
                        name={false}
                        displayObjectSize={false}
                        displayDataTypes={false}
                      />
                    )}
                  </div>
                )}
              </form>
            </FormProvider>
          )}

          {loading && <Loading message="Submitting..." />}
        </>
      )}
    </AuthLayout>
  );
};

Transaction.propTypes = {
  user: PropTypes.any,
  showAlertBox: PropTypes.func,
};
Transaction.defaultProps = {};

export default Transaction;
