import { React, useState } from "react";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./CreateWallet.module.scss";
import AuthLayout from "../AuthLayout";
import copyIcon from "src/assets/icons/copy.svg";

const cx = cn.bind(styles);

const CreateWallet = () => {
    const methods = useForm();

    const { register, handleSubmit, formState: { errors } } = methods;
    const [showMnemonics, setShowMnemonics] = useState(false);

    const onSubmit = () => {

    };

    const changeShowMnemonics = () => {
        setShowMnemonics(!showMnemonics)
    };

    const onChangeChecked = () => {};

    return (
        <AuthLayout>
            <div className={cx("card")}>
                <div className={cx("card-header")}>Import Wallet</div>
                <div className={cx("card-body")}>
                    <FormProvider {...methods} >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={cx("field")}>
                                <div className={cx("field-title")}>Mnemonics</div>
                                <div className={cx("field-input")}>
                                    <div className={cx("mnemonics")}>
                                        <input className={cx("text-field")} type={showMnemonics ? "text" : "password"} name="mnemonics" placeholder="" {...register("mnemonics")} />
                                        <div className={cx("copy")}>
                                            <span className={cx("copy-line")}></span>
                                            <img className={cx("copy-image")} src={copyIcon} alt="" />
                                            <span className={cx("copy-btn")}>Copy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cx("show-mnemonics")}>
                                <input type="radio" checked={showMnemonics} className={cx("show-mnemonics-radio")} id="show-mnemonics" name="" onClick={changeShowMnemonics} onChange={onChangeChecked} />
                                <span className={cx("show-mnemonics-text")}>Show the mnemonics</span>
                            </div>

                            <Suggestion text="Copy this mnemonic then go to import page." />

                            <div className={cx("button-space")}>
                                <Button variant="primary" size="lg" submit={true}>
                                    Next
                                </Button>
                            </div>

                            <Button variant="outline-primary" size="lg" onClick={() => {

                            }}>
                                Import Wallet
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </AuthLayout>
    );
};

CreateWallet.propTypes = {
};
CreateWallet.defaultProps = {};

export default CreateWallet;