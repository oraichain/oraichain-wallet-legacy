import { React, useState } from "react";
import cn from "classnames/bind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useForm, FormProvider } from "react-hook-form";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import FormField from "src/components/FormField";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./CreateWallet.module.scss";
import copyIcon from "src/assets/icons/copy.svg";

const cx = cn.bind(styles);

const CreateWallet = ({ history }) => {
    const cosmos = window.cosmos;
    const methods = useForm();
    const { handleSubmit, setValue, getValues } = methods;
    const [copied, setCopied] = useState(false);
    const [showMnemonics, setShowMnemonics] = useState(false);

    const toggleShowMnemonics = () => {
        setShowMnemonics(!showMnemonics);
    };

    const generateMnemonics = () => {
        return cosmos.generateMnemonic(256);
    };

    const copyToClipboard = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onSubmit = (data) => {
        setValue("mnemonics", generateMnemonics());
    };

    return (
        <AuthLayout>
            <FormContainer>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormTitle>Generate Mnemonics</FormTitle>
                        <FormField>
                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <Label>Mnemonics</Label>
                                <CopyToClipboard
                                    onCopy={copyToClipboard}
                                    text={getValues("mnemonics")}
                                >
                                    <div className={cx("copy-button")}>
                                        <img
                                            className={cx("copy-button-icon")}
                                            src={copyIcon}
                                            alt=""
                                        />
                                        <span
                                            className={cx("copy-button-text")}
                                        >
                                            Copy
                                        </span>
                                    </div>
                                </CopyToClipboard>
                            </div>

                            <TextField
                                name="mnemonics"
                                type={showMnemonics ? "text" : "password"}
                                autoComplete="off"
                            />

                            {copied && (
                                <div className={cx("copy-message")}>
                                    Encrypted mnemonic phrase is copied.
                                </div>
                            )}
                        </FormField>

                        <div className={cx("show-mnemonics")}>
                            <input
                                type="radio"
                                checked={showMnemonics}
                                className={cx("show-mnemonics-radio")}
                                id="show-mnemonics"
                                name=""
                                onClick={toggleShowMnemonics}
                                onChange={() => {}}
                            />
                            <label
                                htmlFor="show-mnemonics"
                                className={cx("show-mnemonics-label")}
                            >
                                Show the mnemonics
                            </label>
                        </div>

                        <Suggestion text="Copy this mnemonic then go to import page." />

                        <div className="mb-4">
                            <Button variant="primary" size="lg" submit={true}>
                                Generate
                            </Button>
                        </div>

                        <div className="mb-4">
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => {
                                    history.push(
                                        `/import-wallet${history.location.search}`
                                    );
                                }}
                            >
                                Import Wallet
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </FormContainer>
        </AuthLayout>
    );
};

CreateWallet.propTypes = {};
CreateWallet.defaultProps = {};

export default CreateWallet;
