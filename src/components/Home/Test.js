import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import BlockUi from "react-block-ui";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import queryString from "query-string";
import "react-block-ui/style.css";
import bech32 from "bech32";
import KSUID from "ksuid";
import Long from "long";
import Cosmos from "@oraichain/cosmosjs";
import * as yup from "yup";
import _ from "lodash";

import { Fee, Gas } from "src/components/common/Fee";
import PinWrap, { openPinWrap } from "src/components/PinWrap";
import RequestMenu from "src/components/airequest/RequestMenu";
import { getFileSize } from "src/utils";
import * as actions from "src/actions";
import FormInput from "src/components/common/FormInput/FormInput";

import styles from "./Test.scss";
import cn from "classnames/bind";
const cx = cn.bind(styles);

const message = Cosmos.message;

const CreateAIRequest = ({ user, updateRequestId, history }) => {
  const $ = window.jQuery;
  const { t, i18n } = useTranslation();
  const [blocking, setBlocking] = useState(false);
  const [isOScript, setIsOScript] = useState(false);
  const [inputFile, setInputFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [showInput, setShowInput] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const [gas, setGas] = useState(200000);
  const [fee, setFee] = useState(0);
  const [minFee, setMinFee] = useState({ estimate_fee: 0 });
  const queryStringParse = queryString.parse(history?.location?.search) || {};
  const cosmos = window.cosmos;

  console.log(fee);
  console.log(inputFile, "aaaaa");

  const pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';/{}|\\":<>\?]/);

  yup.addMethod(yup.string, "shouldBeJSON", function () {
    return this.test({
      name: "validate-json",
      exclusive: false,
      message: "Value mustn't be null and should be JSON",
      test(value) {
        if (!_.isNil(inputFile)) {
          return true;
        } else if (!_.isNil(value)) {
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

  const validationSchemaForm = yup.object().shape({
    input: yup.string().shouldBeJSON("shouldBeJSON"),
    expected_output: yup.string().shouldBeJSON("shouldBeJSON"),
    oscript_name: yup.string().required("Name field is required"),
    des: yup.string().required("Description field is required"),
    request_fees: yup.number().required("Fees field is required"),
    validator_count: yup.number().required("Validator count field is required"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchemaForm),
  });
  const {
    handleSubmit,
    getValues,
    formState: { errors },
    trigger,
    register,
  } = methods;

  console.log(getValues("input_file"), "!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

  const { onChange: onMemoChange, ...inputMemoRest } = register("memo");

  useEffect(() => {
    async function getMinFee() {
      const result = await axios.get("https://api.scan.orai.io/v1/min_gas");
      if (result && result.data) {
        setMinFee(result.data);
      }
    }
    getMinFee();
  }, []);

  useEffect(() => {
    const handler = (e, file) => {
      processFile(file, e.target.name);
    };
    $("#filename").on("file", handler);
    return () => {
      $("#filename").off("file", handler);
    };
  }, []);

  const clearFile = (e) => {
    if (e.target.name === "trash_output") {
      $("#filename").text("Output file");
      setOutputFile(null);
    } else {
      $("#filename").text("Input file");
      setInputFile(null);
    }
  };

  const onFileChange = (e) => {
    return processFile(e.target.files[0], e.target.name);
  };

  const onType = (e) => {
    if (e.target.name === "input") {
      let input = e.target.value;
      // if empty = 0 then show file option
      if (input?.length === 0) {
        setShowInput(true);
      } else {
        setShowInput(false);
        setInputFile(null);
      }
    } else {
      let output = e.target.value;
      // if empty = 0 then show file option
      if (output?.length === 0) {
        setShowOutput(true);
      } else {
        setShowOutput(false);
        setOutputFile(null);
      }
    }
  };

  const processFile = async (file, name) => {
    if (!file) return;

    let fileBuffer;
    if (file.data) {
      fileBuffer = file.data;
    } else {
      const blob = new Blob([file]);
      fileBuffer = await blob.arrayBuffer();
    }
    let buffer = Buffer.from(fileBuffer).toString();
    if (name === "input_file") {
      setInputFile(buffer);
    } else if (name === "output_file") {
      setOutputFile(buffer);
    }
    $("#filename").html(
      `<strong>${file.name} (${getFileSize(file.size)})</strong>`
    );
  };

  const handleSet = async (value) => {
    const oscriptName = value?.oscript_name?.trim();
    try {
      const data = await fetch(
        `${cosmos.url}/provider/oscript/${oscriptName}`
      ).then((res) => res.json());
      if (data.code !== undefined) {
        alert("current name of the script is not found");
        return;
      }
      let description = value?.des?.trim();
      let valCount = value?.validator_count?.trim();
      let requestFees = value?.request_fees?.trim();
      let memo = value?.memo?.trim();
      let input = value?.input?.trim();
      let expectedOutput = value?.expected_output?.trim();
      if (
        pattern.test(oscriptName) ||
        pattern.test(description) ||
        Number.isInteger(parseInt(valCount)) === false ||
        pattern.test(memo)
      ) {
        alert("inputs has invalid values");
        return;
      }
      openPinWrap();
    } catch (err) {
      console.log(err);
      alert("unexpected error from the server: ", err);
      return;
    }
  };

  const getTxBody = (childKey) => {
    let oscriptName = getValues("oscript_name");
    let accAddress = bech32.fromWords(bech32.toWords(childKey.identifier));
    let description = getValues("des");
    let valCount = getValues("validator_count");
    let requestFees = getValues("request_fees");
    let memo = getValues("memo");
    let input = getValues("input");
    let expectedOutput = getValues("expected_output");
    let reqId = KSUID.randomSync().string;
    if (inputFile.length !== 0) {
      input = inputFile;
    }
    if (outputFile.length !== 0) {
      expectedOutput = outputFile;
    }
    const msgSend = new message.oraichain.orai.airequest.MsgSetAIRequest({
      request_id: reqId,
      oracle_script_name: oscriptName,
      creator: accAddress,
      validator_count: new Long(valCount),
      fees: `${requestFees}orai`,
      input: Buffer.from(input),
      expected_output: Buffer.from(expectedOutput),
    });

    const msgSendAny = new message.google.protobuf.Any({
      type_url: "/oraichain.orai.airequest.MsgSetAIRequest",
      value: message.oraichain.orai.airequest.MsgSetAIRequest.encode(
        msgSend
      ).finish(),
    });

    return new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny],
      memo: memo,
    });
  };

  const onChildKey = async (childKey) => {
    try {
      setBlocking(true);
      // will allow return childKey from Pin
      const txBody = getTxBody(childKey);
      // higher gas limit
      const res = await cosmos.submit(
        childKey,
        txBody,
        "BROADCAST_MODE_BLOCK",
        fee * 1000000,
        gas
      );
      if (res.tx_response.code !== 0) {
        alert(res.tx_response.raw_log);
        return;
      }
      const requestId = JSON.parse(res.tx_response.raw_log)[0].events[0]
        .attributes[0].value;
      $("#tx-json").text(
        res.tx_response.raw_log + "\n" + "request id: " + requestId
      );
      // check if the broadcast message is successful or not
      updateRequestId({ requestId });
      if (queryStringParse.signInFromScan) {
        window.opener.postMessage(res.tx_response, "*");
        window.close();
      } else {
        $("#tx-json").text(res.tx_response.raw_log);
      }
    } catch (ex) {
      alert(ex.message);
      return;
    } finally {
      setBlocking(false);
    }
  };

  const onSubmit = (data) => {
    handleSet(data);
  };

  const onError = (err) => {};

  const handleClickSubmit = async () => {
    await trigger();
    if (errors && Object?.values?.(errors)?.length === 0)
      return onSubmit(getValues());
    else return;
  };

  return (
    <BlockUi tag="div" blocking={blocking}>
      <RequestMenu selected="set" />
      <FormProvider {...methods}>
        <div className={cx("set-request")}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="keystation-form"
          >
            <FormInput
              classNameCustom={`form-control, ${cx("account-input")}`}
              name="account"
              errorobj={errors}
            />
            <FormInput
              classNameCustom={`form-control, ${cx("password-input")}`}
              name="password"
              errorobj={errors}
              autoComplete="current-password"
            />
            <div className="keystation-tx-info" id="tx-info">
              <h3 className="send">Set</h3>

              <div className={cx("row", "row-custom")}>
                <div class="col-4 text-right">{t("creator")}</div>
                <div class="col-4">
                  <p>{user?.address} </p>
                </div>
              </div>

              <div className={cx("row", "row-custom")}>
                <div class="col-4 text-right">{t("oracleScriptName")}</div>
                <div class="col-4">
                  <FormInput
                    classNameCustom={`form-control, ${cx(
                      "form-control-custom"
                    )}`}
                    name="oscript_name"
                    errorobj={errors}
                  />
                </div>
              </div>

              <div className={cx("row", "row-custom")}>
                <div class="col-4 text-right">{t("description")}</div>
                <div class="col-4">
                  <FormInput
                    classNameCustom={`form-control, ${cx(
                      "form-control-custom"
                    )}`}
                    name="des"
                    errorobj={errors}
                  />
                </div>
              </div>

              <div className={cx("row", "row-custom")}>
                <div class="col-4 text-right">{t("validatorCount")}</div>
                <div class="col-4">
                  <FormInput
                    classNameCustom={`form-control, ${cx(
                      "form-control-custom"
                    )}`}
                    name="validator_count"
                    errorobj={errors}
                  />
                </div>
              </div>

              <div className={cx("row", "row-custom")}>
                <div class="col-4 text-right">{t("requestFees")}</div>
                <div class="col-4">
                  <FormInput
                    classNameCustom={`form-control, ${cx(
                      "form-control-custom"
                    )}`}
                    name="request_fees"
                    errorobj={errors}
                  />
                </div>
              </div>

              <div className={cx("row", "row-custom")}>
                <div class="col-4 text-right">{t("input")}</div>
                <div class="col-4">
                  {_.isNil(inputFile) && (
                    <FormInput
                      classNameCustom={`form-control, ${cx(
                        "form-control-custom"
                      )}`}
                      name="input"
                      errorobj={errors}
                      onInput={onType}
                    />
                  )}
                  {showInput && (
                    <>
                      <FormInput
                        classNameCustom={`form-control,${cx("file")}`}
                        name="input_file"
                        errorobj={errors}
                        type="file"
                        onChange={onFileChange}
                      />
                      <i className="fa fa-cloud-upload" />
                      <small id="filename">Input file json</small>
                      {inputFile && (
                        <i
                          className="fa fa-trash"
                          name="trash_output"
                          onClick={clearFile}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={cx("row", "row-custom")}>
                <div class="col-4 text-right">{t("output")}</div>
                <div class="col-4">
                  {_.isNil(outputFile) && (
                    <FormInput
                      classNameCustom={`form-control, ${cx(
                        "form-control-custom"
                      )}`}
                      name="expected_output"
                      errorobj={errors}
                      onInput={onType}
                    />
                  )}
                  {showOutput && (
                    <>
                      <FormInput
                        classNameCustom={`form-control, ${cx(
                          "form-control-custom"
                        )}, ${cx("file")}`}
                        name="output_file"
                        errorobj={errors}
                        type="file"
                        onChange={onFileChange}
                      />
                      <i className="fa fa-cloud-upload" />
                      <small id="filename">Output file json</small>
                      {outputFile && (
                        <i
                          className="fa fa-trash"
                          name="trash_output"
                          onClick={clearFile}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={cx("row", "row-custom")}>
                <div class="col-4 text-right">{t("memo")}</div>
                <div class="col-4">
                  <textarea
                    id="memo"
                    class={`form-control, ${cx("form-control-custom")}`}
                    onChange={(e) => {
                      onMemoChange(e);
                    }}
                    {...inputMemoRest}
                  ></textarea>
                </div>
              </div>
              <div className={`text-center, ${cx("row", "row-custom")}`}>
                <div className={"offset-2 col-7"}>
                  <Gas gas={gas} onChangeGas={setGas} />
                  <Fee minFee={minFee} handleChooseFee={setFee} />
                  <div class={`offset-6 col-4, ${cx("last-row-custom")}`}>
                    <button
                      onClick={handleClickSubmit}
                      class="btn btn-primary"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </FormProvider>

      <div className="keystation-tx-json" id="tx-json"></div>

      <PinWrap show={false} pinType="tx" onChildKey={onChildKey} />
    </BlockUi>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, actions)(CreateAIRequest);
