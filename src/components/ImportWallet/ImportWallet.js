import { React, useState } from "react";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./ImportWallet.module.scss";
import AuthLayout from "../AuthLayout";
import Pin from "../Pin";
import EncryptedMnemonic from "../EncryptedMnemonic";
import ErrorText from "../ErrorText";
import Field from "../Field";

const cx = cn.bind(styles);

const ImportWallet = () => {
    const methods = useForm();
    const { register, handleSubmit, formState: { errors } } = methods;

    const [step, setStep] = useState(1);
    const [data, setData] = useState({});
    const [encryptedMnemonics, setEncryptedMnemonics] = useState('');

    const onSubmit = (data) => {
        setData(data)
        setStep(2)
    };

    const MainLayout = () =>
        <AuthLayout><div className={cx("card")}>
            <div className={cx("card-header")}>Import Wallet</div>
            <div className={cx("card-body")}>
                <FormProvider {...methods} >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Field
                            title="Walletname"
                            input={<input type="text" className={cx("text-field")} defaultValue={data.walletName} name="walletName" placeholder="" {...register("walletName", { required: true })} />}
                        />

                        <Field
                            title="Mnemonics"
                            input={<textarea className={cx("text-field", "text-area")} defaultValue={data.mnemonics} name="mnemonics" placeholder="" {...register("mnemonics", { required: true })} />}
                        />

                        {(errors.mnemonics || errors.walletName) && <ErrorText>Invalid account.</ErrorText>}

                        <Suggestion text="Enter 12 / 16 / 24 words including spaces. Mnemonicphrase is encrypted and stored in Keychain." />

                        <div className={cx("button-space")}>
                            <Button variant="primary" size="lg" submit={true}>
                                Next
                            </Button>
                        </div>

                        <Button variant="outline-primary" size="lg" onClick={() => {
                            alert('Sign In')
                        }}>
                            Sign In
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div></AuthLayout>

    return (
        <div>
            {step === 1 && <MainLayout />}
            {step === 2 && <Pin setStep={setStep} currentStep={step} message="Please set your PIN" mnemonics={data.mnemonics} setEncryptedMnemonics={setEncryptedMnemonics} />}
            {step === 3 && <Pin setStep={setStep} currentStep={step} message="Please confirm your PIN" mnemonics={data.mnemonics} checkPin={true} encryptedMnemonics={encryptedMnemonics} />}
            {step === 4 && <EncryptedMnemonic encryptedMnemonics={encryptedMnemonics} />}
        </div>
    );
};

ImportWallet.propTypes = {
};
ImportWallet.defaultProps = {
};

export default ImportWallet;