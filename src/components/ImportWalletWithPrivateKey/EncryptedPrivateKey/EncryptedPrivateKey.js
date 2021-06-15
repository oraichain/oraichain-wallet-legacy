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
import Button from "src/components/Button";
import styles from "./EncryptedPrivateKey.module.scss";
import copyIcon from "src/assets/icons/copy.svg";

const cx = cn.bind(styles);

const EncryptedPrivateKey = ({ setStep, step, queryParam, walletName, encryptedPrivateKey }) => {
    const history = useHistory();

    const schema = yup.object().shape({
        account: yup.string().required("The account is required"),
        privateKey: yup.string().required("The encrypted mnemonics is required"),
    });

    const methods = useForm({
        defaultValues: {
            encryptedPrivateKey: encryptedPrivateKey,
            account: walletName,
        },
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState } = methods;

    const [copied, setCopied] = useState(false);
    const [invalidPrivateKey, setInvalidPrivateKey] = useState(false);

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
        if (data.privateKey !== encryptedPrivateKey) {
            setInvalidPrivateKey(true);
            setTimeout(() => {
                setInvalidPrivateKey(false);
            }, 1000);
        } else {
            history.push({
                search: queryParam,
            });
            localStorage.setItem(walletName + "-password", encryptedPrivateKey);
            goToNextStep();
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>Import Wallet</FormTitle>
                <div className={cx("tutorial")}>Please copy and paste the mnemonic encryption below.</div>
                <FormField>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <Label>Encrypted private key</Label>
                        <CopyToClipboard onCopy={copyToClipboard} text={encryptedPrivateKey}>
                            <div className={cx("copy-button")}>
                                <img className={cx("copy-button-icon")} src={copyIcon} alt="" />
                                <span className={cx("copy-button-text")}>Copy</span>
                            </div>
                        </CopyToClipboard>
                    </div>

                    <TextArea disabled={true} name="encryptedPrivateKey" />
                    <ErrorMessage
                        errors={formState.errors}
                        name="encryptedPrivateKey"
                        render={({ message }) => <ErrorText>{message}</ErrorText>}
                    />

                    {copied && <div className={cx("copy-message")}>Encrypted private key is copied.</div>}
                </FormField>

                <TextField name="account" className="d-none" />

                <FormField>
                    <Label>Encrypted private key</Label>
                    <TextField type="password" name="privateKey" autoComplete="new-password" />
                    {formState.errors.privateKey && <ErrorText>Invalid private key.</ErrorText>}
                    {invalidPrivateKey && <ErrorText>Encrypted private key does not match.</ErrorText>}
                </FormField>

                {/* <Suggestion
                    text="Why do I have to encrypt my private key?"
                    showModalWhenClick={true}
                    modalTitle={
                        <h5>Why do I have to encrypt my private key?</h5>
                    }
                    modalBody={
                        <>
                            <p>Here are the reasons:</p>
                            <ol>
                                <li>
                                    Keystore is an encrypted private key, it is not easy to write down all the code
                                    correctly. Moreover, users often think that the keystore is secure and they transmit
                                    or store it through the network. It will lead to leaking of keystore which will
                                    greatly increase the risk of asset theft.
                                </li>
                                <li>
                                    The security level of the private key is the same as mnemonic phrases. They are both
                                    unencrypted private keys. However, it is inconvenient to copy and save the private
                                    key. Once the transcription is wrong, it is difficult to correct and retrieve it.
                                </li>
                                <li>
                                    Mnemonic phrases manage multi-chain wallets. Using only one Mnemonic phrase you can
                                    manage assets on multiple chains.
                                </li>
                            </ol>
                        </>
                    }
                /> */}

                <div className="d-flex flex-row justify-content-center mb-4">
                    <Button variant="primary" size="lg" type="submit">
                        Next
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

EncryptedPrivateKey.propTypes = {};
EncryptedPrivateKey.defaultProps = {};

export default EncryptedPrivateKey;
