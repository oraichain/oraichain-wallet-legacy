import { React, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import cn from "classnames/bind";
import _ from "lodash";
import queryString from "query-string";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { anotherAppLogin } from "src/utils";
import { ErrorMessage } from "@hookform/error-message";
import { pagePaths } from "src/consts/pagePaths";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import FormTitle from "src/components/FormTitle";
import FormField from "src/components/FormField";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import ErrorText from "src/components/ErrorText";
import Pin from "src/components/Pin";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import QuestionLink from "src/components/QuestionLink";
import styles from "./SignIn.module.scss";

const cx = cn.bind(styles);

const steps = {
    SIGIN_FORM: 1,
    PIN: 2,
};

const SignIn = ({ setUser }) => {
    const history = useHistory();
    const location = useLocation();
    const schema = yup.object().shape({
        walletName: yup.string().required("The Wallet Name is required"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
    });
    const { handleSubmit, formState, watch } = methods;

    const [step, setStep] = useState(steps.SIGIN_FORM);
    const [pinData, setPinData] = useState({
        walletName: null,
        password: null,
    });
    const [invalidMnemonics, setInvalidMnemonics] = useState(false);
    let queryParse;
    if (location && location.state && location.state.from) {
        queryParse = queryString.parse(location.state.from.search) || {};
    } else {
        queryParse = queryString.parse(history.location.search) || {};
    }

    const onSubmit = (data) => {
        const password = data.password || localStorage.getItem(data.walletName + "-password") || "";

        if (password === "") {
            setInvalidMnemonics(true);
        } else {
            setInvalidMnemonics(false);
            setPinData({
                walletName: data.walletName,
                password: password,
            });
            setStep(steps.PIN);
        }
    };

    const signinForm = (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>SignIn</FormTitle>
                <FormField>
                    <Label>Walletname</Label>
                    <TextField type="text" autoComplete="username" name="walletName" />
                    <ErrorMessage
                        errors={formState.errors}
                        name="walletName"
                        render={({ message }) => <ErrorText>{message}</ErrorText>}
                    />
                </FormField>

                <FormField>
                    <TextField type="password" autoComplete="current-password" name="password" className="d-none" />
                    {invalidMnemonics && (
                        <ErrorText>
                            Could not retrieve account stored in Keychain. Press the button below the Import Wallet.
                        </ErrorText>
                    )}
                </FormField>

                <Suggestion text=" Unavailable in guest mode or incognito mode." />

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
                            history.push(`/import-wallet${history.location.search}`);
                        }}
                    >
                        Import Wallet
                    </Button>
                </div>

                <QuestionLink
                    questionText="Don't have Mnemonics?"
                    linkTo={`${pagePaths.GENERATE_MNEMONICS}${history.location.search}`}
                    linkText="Generate Mnemonics"
                />
            </form>
        </FormProvider>
    );

    return (
        <AuthLayout>
            <FormContainer>
                {step === steps.SIGIN_FORM && signinForm}
                {step === steps.PIN && (
                    <Pin
                        title="Enter your PIN"
                        step={step}
                        pinType="signin"
                        walletName={pinData?.walletName}
                        encryptedMnemonics={pinData?.password}
                        setStep={setStep}
                        setUser={setUser}
                    />
                )}
            </FormContainer>
        </AuthLayout>
    );
};

SignIn.propTypes = {};
SignIn.defaultProps = {};

export default SignIn;
