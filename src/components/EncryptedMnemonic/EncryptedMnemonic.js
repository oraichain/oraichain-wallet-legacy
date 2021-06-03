import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import FormTitle from "src/components/FormTitle";
import FormField from "src/components/FormField";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import TextArea from "src/components/TextArea";
import ErrorText from "src/components/ErrorText";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./EncryptedMnemonic.module.scss";
import copyIcon from "src/assets/icons/copy.svg";

const cx = cn.bind(styles);

const EncryptedMnemonic = ({
    setStep,
    step,
    queryParam,
    walletName,
    encryptedMnemonics,
}) => {
    console.log("EncryptedMnemonic");
    const history = useHistory();

    const schema = yup.object().shape({
        account: yup.string().required("The account is required"),
        mnemonics: yup.string().required("The encrypted mnemonics is required"),
    });

    const methods = useForm({
        defaultValues: {
            encryptedMnemonics: encryptedMnemonics,
            account: walletName,
        },
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState } = methods;

    const [copied, setCopied] = useState(false);
    const [invalidMnemonics, setInvalidMnemonics] = useState(false);

    const goToNextStep = () => {
        setStep(step + 1);
    };

    const copyToClipboard = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onSubmit = (data) => {
        if (data.mnemonics !== encryptedMnemonics) {
            setInvalidMnemonics(true);
            setTimeout(() => {
                setInvalidMnemonics(false);
            }, 1000);
        } else {
            history.push({
                search: queryParam,
            });
            localStorage.setItem(walletName + "-password", encryptedMnemonics);
            goToNextStep();
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>Import Wallet</FormTitle>
                <div className={cx("tutorial")}>
                    Please copy and paste the mnemonic encryption below.
                </div>
                <FormField>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <Label>Encrypted mnemonic pharse</Label>
                        <CopyToClipboard
                            onCopy={copyToClipboard}
                            text={encryptedMnemonics}
                        >
                            <div className={cx("copy-button")}>
                                <img
                                    className={cx("copy-button-icon")}
                                    src={copyIcon}
                                    alt=""
                                />
                                <span className={cx("copy-button-text")}>
                                    Copy
                                </span>
                            </div>
                        </CopyToClipboard>
                    </div>

                    <TextArea disabled={true} name="encryptedMnemonics" />
                    <ErrorMessage
                        errors={formState.errors}
                        name="encryptedMnemonics"
                        render={({ message }) => (
                            <ErrorText>{message}</ErrorText>
                        )}
                    />

                    {copied && (
                        <div className={cx("copy-message")}>
                            Encrypted mnemonic phrase is copied.
                        </div>
                    )}
                </FormField>

                <TextField name="account" className="d-none" />

                <FormField>
                    <Label>Encrypted mnemonic pharse</Label>
                    <TextField
                        type="password"
                        name="mnemonics"
                        autoComplete="new-password"
                    />
                    {formState.errors.mnemonics && (
                        <ErrorText>Invalid mnemonics.</ErrorText>
                    )}
                    {invalidMnemonics && (
                        <ErrorText>
                            Encrypted mnemonic phrase does not match.
                        </ErrorText>
                    )}
                </FormField>

                <a
                    href="https://medium.com/cosmostation/introducing-keystation-end-to-end-encrypted-key-manager-for-dapps-built-with-the-cosmos-sdk-37dac753feb5"
                    target="blank"
                >
                    <Suggestion text="Why do I have to encrypt my mnemonic pharse?" />
                </a>

                <div className="d-flex flex-row justify-content-center mb-4">
                    <Button variant="primary" size="lg" submit={true}>
                        Next
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

EncryptedMnemonic.propTypes = {};
EncryptedMnemonic.defaultProps = {};

export default EncryptedMnemonic;
