import { React, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { pagePaths } from "src/consts/pagePaths";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import FormField from "src/components/FormField";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "src/components/CreateWallet/CreateWallet.module.scss";
import copyIcon from "src/assets/icons/copy.svg";
import { cleanMnemonics, countWords } from "src/utils";
import ConnectWalletContainer from "src/containers/ConnectWalletContainer";
import EncryptedMnemonic from "src/components/ImportWalletWithMnemonics/EncryptedMnemonic";
import { ErrorMessage } from "@hookform/error-message";
import ErrorText from "src/components/ErrorText";
import LoopIcon from '@material-ui/icons/Loop';
import Pin from "src/components/Pin";
import TextArea from "src/components/TextArea";
import { useToasts } from "react-toast-notifications";

const cx = cn.bind(styles);

const CreateWallet = () => {
    const cosmos = window.cosmos;
    const history = useHistory();
    const { addToast } = useToasts();

    const schema = yup.object().shape({
        walletName: yup.string().required("The Wallet Name is required"),
        mnemonics: yup.string().required("The Mnemonic is required"),
    });
    const methods = useForm({
        resolver: yupResolver(schema),
    });
    const { handleSubmit, setValue, watch, formState } = methods;

    const enteredPin = useRef("");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [encryptedMnemonics, setEncryptedMnemonics] = useState("");
    const [invalidMnemonics, setInvalidMnemonics] = useState(false);
    const [invalidMnemonicsChecksum, setInvalidMnemonicsChecksum] = useState(false);
    let address = "";

    const copyToClipboard = () => {
        if (watch("mnemonics")) {
            addToast("Mnemonic phrase is copied!", {
                appearance: 'success',
                autoDismiss: true,
            });
        } else {
            addToast("There is no mnemonic phrase to copy.", {
                appearance: 'error',
                autoDismiss: true,
            });
        }
    };

    const generateMnemonic = () => {
        const mnemonics = cosmos.generateMnemonic(256);
        setValue("mnemonics", mnemonics);
    };

    useEffect(() => {
        generateMnemonic();
    }, [])

    const isMnemonicsValid = (mnemonics, disablechecksum = false) => {
        let validFlag = true;
        // To check the checksum, it is a process to check whether there is an error in creating an address, so you can input any path and prefix.
        try {
            if (disablechecksum) {
                address = cosmos.getAddress(mnemonics, false);
            } else {
                address = cosmos.getAddress(cleanMnemonics(mnemonics));
            }
        } catch (e) {
            validFlag = false;
        }
        return validFlag;
    };

    const onSubmit = (data) => {
        const mnemonic = data.mnemonics.trim();
        if (countWords(mnemonic) !== 12 && countWords(mnemonic) !== 16 && countWords(mnemonic) !== 24) {
            setInvalidMnemonics(true);
            setInvalidMnemonicsChecksum(false);
        } else if (!isMnemonicsValid(mnemonic)) {
            setInvalidMnemonics(false);
            setInvalidMnemonicsChecksum(true);
        } else {
            // console.log("ADDRESS", address);
            setFormData(
                Object.assign({}, data, {
                    address: address,
                })
            );
            setInvalidMnemonics(false);
            setInvalidMnemonicsChecksum(false);
            setStep(2);
        }
    };

    const createWalletForm = (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>Create wallet</FormTitle>
                <FormField>
                    <Label>Wallet name</Label>
                    <TextField type="text" name="walletName" />
                    <ErrorMessage
                        errors={formState.errors}
                        name="walletName"
                        render={({ message }) => <ErrorText>{message}</ErrorText>}
                    />
                </FormField>

                <FormField>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <Label>Mnemonic</Label>
                        <CopyToClipboard
                            onCopy={copyToClipboard}
                            text={watch("mnemonics")}
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

                    <TextArea name="mnemonics" />

                    <ErrorMessage
                        errors={formState.errors}
                        name="mnemonics"
                        render={({ message }) => <ErrorText>{message}</ErrorText>}
                    />
                    {invalidMnemonics && <ErrorText>Mnemonics is not valid.</ErrorText>}
                    {invalidMnemonicsChecksum && <ErrorText>Invalid mnemonics checksum error.</ErrorText>}

                    <div className="mt-2">
                        <div className={cx("generate-button", "mx-auto")}>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={generateMnemonic}
                            >
                                <LoopIcon />Generate Mnemonic
                            </Button>
                        </div>
                    </div>
                </FormField>

                <Suggestion text="Copy and save the mnemonic phrase. The mnemonic phrase is encrypted and stored in Keychain." />

                <div className="mb-4">
                    <Button variant="primary" size="lg" type="submit">
                        Next
                    </Button>
                </div>

                <div className="mb-4">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                            history.push(`${pagePaths.SIGNIN}${history.location.search}`);
                        }}
                    >
                        Sign In
                    </Button>
                </div>
            </form>
        </FormProvider>
    );

    return (
        <AuthLayout>
            <FormContainer>
                {step === 1 && createWalletForm}
                {step === 2 && (
                    <Pin
                        title="Please set your PIN"
                        setStep={setStep}
                        step={step}
                        mnemonics={formData.mnemonics}
                        setEncryptedMnemonics={setEncryptedMnemonics}
                    />
                )}
                {step === 3 && (
                    <Pin
                        title="Please confirm your PIN"
                        setStep={setStep}
                        step={step}
                        pinType="confirm"
                        encryptedPassword={encryptedMnemonics}
                        setEnteredPin={(pin) => {
                            enteredPin.current = pin;
                        }}
                    />
                )}
                {step === 4 && (
                    <EncryptedMnemonic
                        step={step}
                        walletName={formData.walletName}
                        encryptedMnemonics={encryptedMnemonics}
                        queryParam={history.location.search}
                        setStep={setStep}
                    />
                )}
                {step === 5 && (
                    <ConnectWalletContainer
                        account={formData.walletName}
                        address={formData.address}
                        encryptedMnemonics={encryptedMnemonics}
                        enteredPin={enteredPin.current}
                    />
                )}
            </FormContainer>
        </AuthLayout>
    );
};

CreateWallet.propTypes = {};
CreateWallet.defaultProps = {};

export default CreateWallet;
