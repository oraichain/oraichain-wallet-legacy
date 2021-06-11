import { React, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import _ from "lodash";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { pagePaths } from "src/consts/pagePaths";
import { cleanMnemonics, countWords } from "src/utils";
import ConnectWalletContainer from "src/containers/ConnectWalletContainer";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import FormField from "src/components/FormField";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import TextArea from "src/components/TextArea";
import ErrorText from "src/components/ErrorText";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import Pin from "src/components/Pin";
import EncryptedMnemonic from "src/components/EncryptedMnemonic";
import QuestionLink from "src/components/QuestionLink";
import styles from "./ImportWalletWithPrivateKey.module.scss";

const cx = cn.bind(styles);

const ImportWalletWithPrivateKey = ({}) => {
    const history = useHistory();

    const schema = yup.object().shape({
        walletName: yup.string().required("The Wallet Name is required"),
        privateKey: yup.string().required("The Private Key is required").isPrivateKey("The Private Key is not valid"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState } = methods;
    const cosmos = window.cosmos;
    const enteredPin = useRef("");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [encryptedMnemonics, setEncryptedMnemonics] = useState("");
    let address = "";

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
        setFormData(
            Object.assign({}, data, {
                address: address,
            })
        );
        setStep(2);
    };

    const importWalletForm = (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>Import Wallet With Private Key</FormTitle>
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
                    <Label>Private key</Label>
                    <TextArea name="privateKey" />
                    <ErrorMessage
                        errors={formState.errors}
                        name="privateKey"
                        render={({ message }) => <ErrorText>{message}</ErrorText>}
                    />
                    {/* {!formState?.errors?.privateKey && (
                        <>
                            {invalidMnemonics && <ErrorText>Mnemonics is not valid.</ErrorText>}
                            {invalidMnemonicsChecksum && <ErrorText>Invalid mnemonics checksum error.</ErrorText>}
                        </>
                    )} */}
                </FormField>

                <Suggestion text="Enter private key.Private key is encrypted and stored in Keychain." />

                <div className="d-flex flex-row justify-content-center mb-4">
                    <Button variant="primary" size="lg" type="submit">
                        Next
                    </Button>
                </div>

                <div className="d-flex flex-row justify-content-center mb-5">
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

                <QuestionLink
                    questionText="Don't have mnemonics?"
                    linkTo={`${pagePaths.GENERATE_MNEMONICS}${history.location.search}`}
                    linkText="Generate mnemonics"
                />
            </form>
        </FormProvider>
    );

    return (
        <AuthLayout>
            <FormContainer>
                {step === 1 && importWalletForm}
                {step === 2 && (
                    <Pin
                        setStep={setStep}
                        step={step}
                        message="Please set your PIN"
                        mnemonics={formData.mnemonics}
                        setEncryptedMnemonics={setEncryptedMnemonics}
                    />
                )}
                {step === 3 && (
                    <Pin
                        setStep={setStep}
                        step={step}
                        message="Please confirm your PIN"
                        pinType="confirm"
                        encryptedMnemonics={encryptedMnemonics}
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

ImportWalletWithPrivateKey.propTypes = {};
ImportWalletWithPrivateKey.defaultProps = {};

export default ImportWalletWithPrivateKey;
