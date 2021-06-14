import { React, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import _ from "lodash";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { pagePaths } from "src/consts/pagePaths";
import ConnectWalletContainer from "src/containers/ConnectWalletContainer";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import FormField from "src/components/FormField";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import ErrorText from "src/components/ErrorText";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import Pin from "src/components/Pin";
import styles from "./ImportWalletWithEncryptedMnemonics.module.scss";
import Connect from "./Connect/Connect";
import TextArea from "../TextArea";

const cx = cn.bind(styles);

const ImportWalletWithEncryptedMnemonics = ({}) => {
    const history = useHistory();

    const schema = yup.object().shape({
        walletName: yup.string().required("The Wallet Name is required"),
        encryptedMnemonics: yup.string().required("The Encrypted Mnemonics is required"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState } = methods;
    const enteredPin = useRef("");
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const onSubmit = (data) => {
        setFormData(
            Object.assign({}, data)
        );
        setStep(2);
    };

    const importWalletForm = (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>Import Wallet With Encrypted Mnemonics</FormTitle>
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
                    <Label>Encrypted Mnemonics</Label>
                    <TextArea name="encryptedMnemonics" />
                    <ErrorMessage
                        errors={formState.errors}
                        name="encryptedMnemonics"
                        render={({ message }) => <ErrorText>{message}</ErrorText>}
                    />
                </FormField>

                <Suggestion text="Enter your encrypted mnemonic." />

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
            </form>
        </FormProvider>
    );

    return (
        <AuthLayout>
            <FormContainer>
                {step === 1 && importWalletForm}
                {step === 2 && (
                    <Pin
                        title="Enter your PIN"
                        setStep={setStep}
                        step={step}
                        pinType="confirm-encryted-mnemonics"
                        encryptedMnemonics={formData.encryptedMnemonics}
                        formData={formData}
                        setFormData={setFormData}
                        setEnteredPin={(pin) => {
                            enteredPin.current = pin;
                        }}
                    />
                )}
                {step === 3 && (
                    <Connect
                        step={step}
                        formData={formData}
                        queryParam={history.location.search}
                        setStep={setStep}
                    />
                )}
                {step === 4 && (
                    <ConnectWalletContainer
                        account={formData.walletName}
                        address={formData.address}
                        encryptedMnemonics={formData.encryptedMnemonics}
                        enteredPin={enteredPin.current}
                    />
                )}
            </FormContainer>
        </AuthLayout>
    );
};

ImportWalletWithEncryptedMnemonics.propTypes = {};
ImportWalletWithEncryptedMnemonics.defaultProps = {};

export default ImportWalletWithEncryptedMnemonics;
