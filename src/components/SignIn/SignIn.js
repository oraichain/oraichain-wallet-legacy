import { React, useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import _ from "lodash";
import queryString from "query-string";
import { anotherAppLogin } from "src/utils";
import AuthLayout from "src/components/AuthLayout";
import Field from "src/components/Field";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import OrDivider from "src/components/OrDivider";
import ErrorText from "src/components/ErrorText";
import Pin from "src/components/Pin";
import styles from "./SignIn.module.scss";

const cx = cn.bind(styles);

const SignIn = ({ history, location, user, setUser }) => {

    const isLoggedIn = !_.isNil(user);
    const methods = useForm();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const [step, setStep] = useState(1);
    const [data, setData] = useState({});
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
            data.password = password;
            setData(data);
            setStep(2);
        }
    };

    const MainLayout = () => (
        <AuthLayout>
            <div className={cx("card")}>
                <div className={cx("card-header")}>Sign In</div>
                <div className={cx("card-body")}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Field
                                title="Walletname"
                                input={
                                    <input
                                        type="text"
                                        className={cx("text-field")}
                                        defaultValue={data.walletName}
                                        name="walletName"
                                        autoComplete="username"
                                        placeholder=""
                                        {...register("walletName", { required: true })}
                                    />
                                }
                            />
                            {errors.walletName && <ErrorText>Invalid account.</ErrorText>}

                            <input
                                type="password"
                                className={cx("text-field-hidden")}
                                name="password"
                                autoComplete="current-password"
                                placeholder=""
                                {...register("password")}
                            />
                            {invalidMnemonics && (
                                <ErrorText>
                                    Could not retrieve account stored in Keychain. Press the button below the Import Wallet.
                                </ErrorText>
                            )}

                            <Suggestion text=" Unavailable in guest mode or incognito mode." />

                            <Button variant="primary" size="lg" submit={true}>
                                Next
                            </Button>
                        </form>
                    </FormProvider>

                    <OrDivider />

                    <Link to={`/import-wallet${history.location.search}`}>
                        <Button variant="outline-primary" size="lg">
                            Import Wallet
                        </Button>
                    </Link>
                </div>
                <div className={cx("card-footer")}>
                    <div className={cx("question")}>
                        <div className={cx("question-text")}>Dont have a wallet?</div>
                        <Link to={`/create-wallet${history.location.search}`} className={cx("question-link")}>
                            Create Wallet
                        </Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );

    return !isLoggedIn ? (
        <div>
            {step === 1 && <MainLayout />}
            {step === 2 && (
                <Pin
                    setStep={setStep}
                    currentStep={step}
                    pinType="signin"
                    walletName={data.walletName}
                    encryptedMnemonics={data.password}
                    closePopup={queryParse.signInFromScan}
                    setUser={setUser}
                    anotherAppLogin={(!_.isNil(queryParse?.via) && queryParse.via === "dialog") ? anotherAppLogin : null}
                />
            )}
        </div>
    ) : (
        <>{history?.push("/")}</>
    );
};

SignIn.propTypes = {};
SignIn.defaultProps = {};

export default SignIn;
