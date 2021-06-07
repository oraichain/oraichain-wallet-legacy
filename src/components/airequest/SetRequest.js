import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import BlockUi from "react-block-ui";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import queryString from "query-string";
import "react-block-ui/style.css";
import bech32 from "bech32";
import KSUID from "ksuid";
import Long from "long";
import Cosmos from "@oraichain/cosmosjs";

import { Fee, Gas } from "../common/Fee";
import PinWrap, { openPinWrap } from "../PinWrap";
import RequestMenu from "./RequestMenu";
import { getFileSize } from "../../utils";
import * as actions from "../../actions";

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
  const queryStringParse = queryString.parse(history.location.search) || {};
  const cosmos = window.cosmos;

  console.log(fee)

  const pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';/{}|\\":<>\?]/);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
  });
  const { onChange: onInputChange, ...inputRest } = register("input", {
    required: {
      value: true,
      message: "Input value mustn't be null",
    },
    validate: (value) => {
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        return "Input value must be JSON";
      }
    },
  });
  const { onChange: onAccountChange, ...inputAccountRest } = register(
    "account"
  );
  const { onChange: onPasswordChange, ...inputPasswordRest } = register(
    "password"
  );
  const { onChange: onOScriptChange, ...inputOScriptRest } = register(
    "oscript_name",
    {
      validate: (value) => {
        return typeof value === "string" || "Name value must be String!";
      },
      required: {
        value: true,
        message: "Name value mustn't be null",
      },
    }
  );
  const { onChange: onDescriptionChange, ...inputDescriptionRest } = register(
    "des",
    {
      validate: (value) => {
        return typeof value === "string" || "Description value must be String!";
      },
      required: {
        value: true,
        message: "Description value mustn't be null",
      },
    }
  );
  const { onChange: onFeeChange, ...inputFeeRest } = register("request_fees", {
    validate: (value) => {
      return !isNaN(value) || "Fee value must be Number!";
    },
    required: {
      value: true,
      message: "Fee value mustn't be null",
    },
  });
  const { onChange: onMemoChange, ...inputMemoRest } = register("memo");
  const {
    onChange: onExpectedOutputChange,
    ...inputExpectedOutputRest
  } = register("expected_output");
  const { onChange: onValCountChange, ...inputValCountRest } = register(
    "validator_count",
    {
      validate: (value) => {
        return !isNaN(value) || "Validator count value must be Number!";
      },
      required: {
        value: true,
        message: "Validator count value mustn't be null",
      },
    }
  );
  const { onChange: onInputFileChange, ...inputInputFileRest } = register(
    "input_file"
  );
  const { onChange: onOutputFileChange, ...inputOutputFileRest } = register(
    "output_file"
  );

  useEffect(() => {
     async function getMinFee() {
        const result = await axios.get('https://api.scan.orai.io/v1/min_gas');
        if (result && result.data) {
          setMinFee(result.data);
        }
     }
     getMinFee();
  }, [])

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

  return (
    <BlockUi tag="div" blocking={blocking}>
      <RequestMenu selected="set" />
      <form
        revalidateMode
        onSubmit={handleSubmit(onSubmit, onError)}
        className="keystation-form"
      >
        <input
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
        />
        <div className="keystation-tx-info" id="tx-info">
          <h3 className="send">Set</h3>
          <div class="mb-3">
            <label class="form-label">{t("creator")}</label>
            <p>{user.address} </p>
          </div>
          <div class="mb-3">
            <label class="form-label">{t("oracleScriptName")}</label>
            <input
              type="text"
              class="form-control"
              id="oscript-name"
              onChange={(e) => {
                onOScriptChange(e);
              }}
              {...inputOScriptRest}
            />
            <ErrorMessage
              errors={errors}
              name="oscript_name"
              render={({ message }) => (
                <p style={{ color: "red" }}>{message}</p>
              )}
            />
          </div>
          <div class="mb-3">
            <label class="form-label">{t("description")}</label>
            <input
              type="text"
              class="form-control"
              id="des"
              onChange={(e) => {
                onDescriptionChange(e);
              }}
              {...inputDescriptionRest}
            />
            <ErrorMessage
              errors={errors}
              name="des"
              render={({ message }) => (
                <p style={{ color: "red" }}>{message}</p>
              )}
            />
          </div>
          <div class="mb-3">
            <label class="form-label">{t("validatorCount")}</label>
            <input
              type="text"
              class="form-control"
              id="validator-count"
              onChange={(e) => {
                onValCountChange(e);
              }}
              {...inputValCountRest}
            />
            <ErrorMessage
              errors={errors}
              name="validator_count"
              render={({ message }) => (
                <p style={{ color: "red" }}>{message}</p>
              )}
            />
          </div>
          <div class="mb-3">
            <label class="form-label">{t("requestFees")}</label>
            <input
              type="text"
              class="form-control"
              id="request-fees"
              onChange={(e) => {
                onFeeChange(e);
              }}
              {...inputFeeRest}
            />
            <ErrorMessage
              errors={errors}
              name="request_fees"
              render={({ message }) => (
                <p style={{ color: "red" }}>{message}</p>
              )}
            />
          </div>
          <div class="mb-3">
            <label class="form-label">{t("input")}</label>
            <input
              type="text"
              class="form-control"
              id="input"
              onInput={onType}
              onChange={(e) => {
                onInputChange(e);
              }}
              {...inputRest}
            />
            {showInput && (
              <label className="file-upload">
                <input
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
                />
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
            <input
              type="text"
              class="form-control"
              id="expected-output"
              onInput={onType}
              onChange={(e) => {
                onExpectedOutputChange(e);
              }}
              {...inputExpectedOutputRest}
            />
            {showOutput && (
              <label className="file-upload">
                <input
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
                />
                <i className="fa fa-cloud-upload" />{" "}
                <small id="filename">Output file json</small>{" "}
                {outputFile && (
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
                )}
              </label>
            )}
          </div>
          <div class="mb-3">
            <label class="form-label">{t("memo")}</label>
            <textarea
              id="memo"
              class="form-control"
              onChange={(e) => {
                onMemoChange(e);
              }}
              {...inputMemoRest}
            ></textarea>
          </div>
          <Gas gas={gas} onChangeGas={setGas} />
          <Fee minFee={minFee} handleChooseFee={setFee} />
        </div>
        <div className="tx-btn-wrap btn-center">
          <button type="submit" id="allowBtn">
            Submit
          </button>
        </div>
      </form>

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
