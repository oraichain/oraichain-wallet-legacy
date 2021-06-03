import { React, useRef, useState } from "react";
import cn from "classnames/bind";
import _ from "lodash";
import queryString from "query-string";
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
import styles from "./ImportWallet.module.scss";

const cx = cn.bind(styles);

const ImportWallet = ({ history, user }) => {
    const schema = yup.object().shape({
        walletName: yup.string().required("The Wallet Name is required"),
        mnemonics: yup.string().required("The Mnemonics is required"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState } = methods;
    const cosmos = window.cosmos;
    const queryParse = queryString.parse(history.location.search);
    const enteredPin = useRef("");
    const [step, setStep] = useState(1);
    const [data, setData] = useState({});
    const [encryptedMnemonics, setEncryptedMnemonics] = useState("");
    const [invalidMnemonics, setInvalidMnemonics] = useState(false);
    const [invalidMnemonicsChecksum, setInvalidMnemonicsChecksum] = useState(false);

    var address = "";
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
            data.address = address;
            setData(data);
            setInvalidMnemonics(false);
            setInvalidMnemonicsChecksum(false);
            setStep(2);
        }
    };

    const importWalletForm = (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>Import Wallet</FormTitle>
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
                    <Label>Mnemonics</Label>
                    <TextArea name="mnemonics" />
                    {(formState.errors.mnemonics || invalidMnemonics) && <ErrorText>Mnemonics is not valid.</ErrorText>}
                    {invalidMnemonicsChecksum && <ErrorText>Invalid mnemonics checksum error.</ErrorText>}
                </FormField>

                <Suggestion text="Enter 24 words including spaces. The mnemonic phrase is encrypted and stored in Keychain." />

                <div className="d-flex flex-row justify-content-center mb-4">
                    <Button variant="primary" size="lg" submit={true}>
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
                        mnemonics={data.mnemonics}
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
                        walletName={data.walletName}
                        encryptedMnemonics={encryptedMnemonics}
                        queryParam={history.location.search}
                        setStep={setStep}
                    />
                )}
                {step === 5 && (
                    <ConnectWalletContainer
                        account={data.walletName}
                        address={data.address}
                        encryptedMnemonics={encryptedMnemonics}
                        enteredPin={enteredPin.current}
                    />
                )}
            </FormContainer>
        </AuthLayout>
    );
};

ImportWallet.propTypes = {};
ImportWallet.defaultProps = {};

export default ImportWallet;
