import { React, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import _ from "lodash";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import * as bip32 from "bip32";
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
import TextArea from "src/components/TextArea";
import ErrorText from "src/components/ErrorText";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import Pin from "src/components/Pin";
import EncryptedPrivateKey from "src/components/ImportWalletWithPrivateKey/EncryptedPrivateKey";
import QuestionLink from "src/components/QuestionLink";
import styles from "./ImportWalletWithPrivateKey.module.scss";

const cx = cn.bind(styles);

const ImportWalletWithPrivateKey = ({ }) => {
    const history = useHistory();

    const schema = yup.object().shape({
        walletName: yup.string().required("The Wallet Name is required"),
        privateKey: yup.string().required("The Private Key is required").isPrivateKey("The Private Key is not valid"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState, watch } = methods;
    const cosmos = window.cosmos;
    const [step, setStep] = useState(1);
    const [encryptedPrivateKey, setEncryptedPrivateKey] = useState("");

    const formData = watch();

    const onSubmit = (data) => {
        // console.log(data);
        // let { privateKey } = data;
        // const buffer = Buffer.from(privateKey, "hex");
        // const { publicKey } = bip32.fromPrivateKey(buffer, Buffer.from(new Array(32)));
        // console.log(getCosmosAddress(publicKey, 'orai'));

        //     privateKey = getChildkeyFromDecrypted(privateKey);
        //    //  const buffer = Buffer.from(privateKey, "hex");
        //     console.log(buf2hex(privateKey.privateKey, "hex"));

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
                        title="Please set your PIN"
                        setStep={setStep}
                        step={step}
                        privateKey={formData.privateKey}
                        setEncryptedPrivateKey={setEncryptedPrivateKey}
                    />
                )}
                {step === 3 && (
                    <Pin
                        title="Please confirm your PIN"
                        setStep={setStep}
                        step={step}
                        pinType="confirm"
                        encryptedPassword={encryptedPrivateKey}
                    />
                )}
                {step === 4 && (
                    <EncryptedPrivateKey
                        step={step}
                        walletName={formData.walletName}
                        queryParam={history.location.search}
                        setStep={setStep}
                        encryptedPrivateKey={encryptedPrivateKey}
                    />
                )}
                {step === 5 && (
                    <ConnectWalletContainer
                        account={formData.walletName}
                        address={formData.address}
                        privateKey={formData.privateKey}
                    />
                )}
            </FormContainer>
        </AuthLayout>
    );
};

ImportWalletWithPrivateKey.propTypes = {};
ImportWalletWithPrivateKey.defaultProps = {};

export default ImportWalletWithPrivateKey;
