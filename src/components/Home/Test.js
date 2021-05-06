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

const message = Cosmos.message;

const CreateAIRequest = ({ user, updateRequestId, history }) => {
  const $ = window.jQuery;
  const { t, i18n } = useTranslation();
  const [blocking, setBlocking] = useState(false);
  const [isOScript, setIsOScript] = useState(false);
  const [inputFile, setInputFile] = useState("");
  const [outputFile, setOutputFile] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const [gas, setGas] = useState(200000);
  const [fee, setFee] = useState(0);
  const [minFee, setMinFee] = useState({ estimate_fee: 0 });
  //   const queryStringParse = queryString.parse(history.location.search) || {};
  const cosmos = window.cosmos;

  console.log(fee);

  const pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';/{}|\\":<>\?]/);

  yup.addMethod(yup.string, "shouldBeJSON", function () {
    return this.test({
      name: "validate-json",
      exclusive: false,
      message: "Value mustn't be null and should be JSON",
      test(value) {
        if (!_.isNil(value)) {
          try {
            let obj = JSON.parse(value);
            if (obj && typeof obj === "object") {
              return true;
            }
            return false;
          } catch (error) {
            return false;
          }
        }
        return false;
      },
    });
  });

  const validationSchemaForm = yup.object().shape({
    input: yup
      .string()
      .required("Input value is required")
      .shouldBeJSON("shouldBeJSON"),
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
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
  } = methods;

  // const { onChange: onAccountChange, ...inputAccountRest } = register(
  //   "account"
  // );
  // const { onChange: onPasswordChange, ...inputPasswordRest } = register(
  //   "password"
  // );

  // const { onChange: onMemoChange, ...inputMemoRest } = register("memo");
  // const {
  //   onChange: onExpectedOutputChange,
  //   ...inputExpectedOutputRest
  // } = register("expected_output");
  // const { onChange: onValCountChange, ...inputValCountRest } = register(
  //   "validator_count",
  //   {
  //     validate: (value) => {
  //       return !isNaN(value) || "Validator count value must be Number!";
  //     },
  //     required: {
  //       value: true,
  //       message: "Validator count value mustn't be null",
  //     },
  //   }
  // );
  // const { onChange: onInputFileChange, ...inputInputFileRest } = register(
  //   "input_file"
  // );
  // const { onChange: onOutputFileChange, ...inputOutputFileRest } = register(
  //   "output_file"
  // );

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
      processFile(file);
    };
    $("#filename").on("file", handler);
    return () => {
      $("#filename").off("file", handler);
    };
  }, []);

  const clearFile = (e) => {
    if (e.target.id === "trash-output") {
      $("#filename").text("Output file");
      $("#output-file").val("");
      setOutputFile("");
    } else {
      $("#filename").text("Input file");
      $("#input-file").val("");
      setInputFile("");
    }
    e.preventDefault();
  };

  const onFileChange = (e) => {
    return processFile(e.target.files[0], e.target.id);
  };

  const onType = (e) => {
    if (e.target.id === "input") {
      let input = $("#input").val();
      // if empty = 0 then show file option
      if (input.length === 0) {
        setShowInput(true);
      } else {
        setShowInput(false);
        setInputFile("");
      }
    } else {
      let output = $("#expected-output").val();
      // if empty = 0 then show file option
      if (output.length === 0) {
        setShowOutput(true);
      } else {
        setShowOutput(false);
        setOutputFile("");
      }
    }
  };

  const processFile = async (file, id) => {
    if (!file) return;

    let fileBuffer;
    if (file.data) {
      fileBuffer = file.data;
    } else {
      const blob = new Blob([file]);
      fileBuffer = await blob.arrayBuffer();
    }

    let buffer = Buffer.from(fileBuffer).toString();
    if (id === "input-file") {
      setInputFile(buffer);
    } else if (id === "output-file") {
      setOutputFile(buffer);
    }
    $("#filename").html(
      `<strong>${file.name} (${getFileSize(file.size)})</strong>`
    );
  };

  const handleSet = async (value) => {
    console.log(value, "kkkkkkkkkkkkkkkkkkkkkkk");
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
      //   if (queryStringParse.signInFromScan) {
      if (1) {
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
    console.log("zzzzzzzz");
    handleSet(data);
  };

  const onError = (err) => {
    console.log(err, "oooooooooooo");
  };

  const handleClickSubmit = async () => {
    await trigger();
    console.log(errors, "oowqeqweqweewq");
    if (errors && Object?.values?.(errors)?.length === 0)
      return onSubmit(getValues());
    else return;
  };

  return (
    <BlockUi tag="div" blocking={blocking}>
      <RequestMenu selected="set" />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="keystation-form"
        >
          {/* <input
            style={{ display: "none" }}
            type="text"
            tabIndex={-1}
            spellCheck="false"
            defaultValue={user.name}
            onChange={(e) => {
              onAccountChange(e);
            }}
            {...inputAccountRest}
          />
          <input
            style={{ display: "none" }}
            type="password"
            autoComplete="current-password"
            tabIndex={-1}
            spellCheck="false"
            onChange={(e) => {
              onPasswordChange(e);
            }}
            {...inputPasswordRest}
          /> */}
          <div className="keystation-tx-info" id="tx-info">
            <h3 className="send">Set</h3>
            <div class="mb-3">
              <label class="form-label">{t("creator")}</label>
              {/* <p>{user.address} </p> */}
            </div>
            <div class="mb-3">
              <label class="form-label">{t("oracleScriptName")}</label>
              <FormInput name="oscript_name" errorobj={errors} />
            </div>
            <div class="mb-3">
              <label class="form-label">{t("description")}</label>
              <FormInput name="des" errorobj={errors} />
            </div>
            <div class="mb-3">
              <label class="form-label">{t("validatorCount")}</label>
              <FormInput name="validator_count" errorobj={errors} />
            </div>
            <div class="mb-3">
              <label class="form-label">{t("requestFees")}</label>
              <FormInput name="request_fees" errorobj={errors} />
            </div>
            <div class="mb-3">
              <label class="form-label">{t("input")}</label>
              <FormInput name="input" errorobj={errors} />
              {showInput && (
                <label className="file-upload">
                  {/* <input
                    type="file"
                    id="input-file"
                    onChange={(e) => {
                      onFileChange(e);
                      onInputFileChange(e);
                    }}
                    {...inputInputFileRest}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="input"
                    render={({ message }) => (
                      <p style={{ color: "red" }}>{message}</p>
                    )}
                  /> */}
                  <i className="fa fa-cloud-upload" />{" "}
                  <small id="filename">Input file json</small>{" "}
                  {inputFile && (
                    <i
                      className="fa fa-trash"
                      id="trash-input"
                      onClick={clearFile}
                    />
                  )}
                </label>
              )}
            </div>
            <div class="mb-3">
              <label class="form-label">{t("output")}</label>
              <FormInput name="expected_output" errorobj={errors} />
              {showOutput && (
                <label className="file-upload">
                  {/* <input
                    type="file"
                    id="output-file"
                    onChange={(e) => {
                      onFileChange(e);
                      onOutputFileChange(e);
                    }}
                    {...inputOutputFileRest}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="expected_output"
                    render={({ message }) => (
                      <p style={{ color: "red" }}>{message}</p>
                    )}
                  /> */}
                  <i className="fa fa-cloud-upload" />{" "}
                  <small id="filename">Output file json</small>{" "}
                  {/* {outputFile && (
                    <i
                      className="fa fa-trash"
                      id="trash-output"
                      onClick={clearFile}
                      onChange={(e) => {
                        onFileChange();
                        onOutputFileChange(e);
                      }}
                      {...inputOutputFileRest}
                    />
                  )} */}
                </label>
              )}
            </div>
            <div class="mb-3">
              <label class="form-label">{t("memo")}</label>
              {/* <textarea
                id="memo"
                class="form-control"
                onChange={(e) => {
                  onMemoChange(e);
                }}
                {...inputMemoRest}
              ></textarea> */}
            </div>
            <Gas gas={gas} onChangeGas={setGas} />
            <Fee minFee={minFee} handleChooseFee={setFee} />
          </div>
          <div className="tx-btn-wrap btn-center">
            <button onClick={handleClickSubmit} type="submit">
              Submit
            </button>
          </div>
        </form>
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
