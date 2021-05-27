import { React, useRef, useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import _ from "lodash";
import queryString from "query-string";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import AuthLayout from "src/components/AuthLayout";
import Pin from "src/components/Pin";
import EncryptedMnemonic from "src/components/EncryptedMnemonic";
import ErrorText from "src/components/ErrorText";
import Field from "src/components/Field";
import { anotherAppLogin, cleanMnemonics, countWords } from "src/utils";
import ConnectWalletContainer from "src/containers/ConnectWalletContainer";
import styles from "./ImportWallet.module.scss";

const cx = cn.bind(styles);

const ImportWallet = ({ history, user }) => {
    const isLoggedIn = !_.isNil(user);
    const methods = useForm();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;
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

    const MainLayout = () => (
        <AuthLayout>
            <div className={cx("card")}>
                <div className={cx("card-header")}>Import Wallet</div>
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
                                        placeholder=""
                                        {...register("walletName", { required: true })}
                                    />
                                }
                            />
                            {errors.walletName && <ErrorText>Invalid account.</ErrorText>}

                            <Field
                                title="Mnemonics"
                                input={
                                    <textarea
                                        className={cx("text-field", "text-area")}
                                        defaultValue={data.mnemonics}
                                        name="mnemonics"
                                        placeholder=""
                                        {...register("mnemonics", { required: true })}
                                    />
                                }
                            />
                            {(errors.mnemonics || invalidMnemonics) && <ErrorText>Mnemonics is not valid.</ErrorText>}
                            {invalidMnemonicsChecksum && <ErrorText>Invalid mnemonics checksum error.</ErrorText>}

                            <Suggestion text="Enter 12 / 16 / 24 words including spaces. Mnemonicphrase is encrypted and stored in Keychain." />

                            <div className={cx("button-space")}>
                                <Button variant="primary" size="lg" submit={true}>
                                    Next
                                </Button>
                            </div>

                            <Link to={`/signin${history.location.search}`}>
                                <Button variant="outline-primary" size="lg">
                                    Sign In
                                </Button>
                            </Link>
                        </form>
                    </FormProvider>
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
                    message="Please set your PIN"
                    mnemonics={data.mnemonics}
                    setEncryptedMnemonics={setEncryptedMnemonics}
                />
            )}
            {step === 3 && (
                <Pin
                    setStep={setStep}
                    currentStep={step}
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
                    setStep={setStep}
                    currentStep={step}
                    queryParam={history.location.search}
                    walletName={data.walletName}
                    encryptedMnemonics={encryptedMnemonics}
                />
            )}
            {step === 5 && (
                <ConnectWalletContainer
                    account={data.walletName}
                    address={data.address}
                    closePopup={queryParse.signInFromScan}
                    encryptedMnemonics={encryptedMnemonics}
                    enteredPin={enteredPin.current}
                    anotherAppLogin={(!_.isNil(queryParse?.via) && queryParse.via === "dialog") ? anotherAppLogin : null}
                />
            )}
        </div>
    ) : (
        <>{history.push("/")}</>
    );
};

ImportWallet.propTypes = {};
ImportWallet.defaultProps = {};

export default ImportWallet;
