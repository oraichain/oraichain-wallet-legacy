import { React, useState } from "react";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./EncryptedMnemonic.module.scss";
import AuthLayout from "../AuthLayout";
import copyIcon from "src/assets/icons/copy.svg";
import ErrorText from "../ErrorText";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Field from "../Field";
import { useHistory } from 'react-router-dom';

const cx = cn.bind(styles);

const EncryptedMnemonic = (props) => {
    const history = useHistory();

    const methods = useForm();
    const { register: importWallet, handleSubmit, formState: { errors } } = methods;

    const [copied, setCopied] = useState(false);
    const [invalidMnemonics, setInvalidMnemonics] = useState(false);

    const goToNextStep = () => {
        props.setStep(props.currentStep + 1);
    }

    const copyToClipboard = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    };

    const onSubmit = (data) => {
        if (data.mnemonics !== props.encryptedMnemonics) {
            setInvalidMnemonics(true)
            setTimeout(() => {
                setInvalidMnemonics(false)
            }, 1000);
        } else {
            history.push({
                search: props.queryParam
            });
            localStorage.setItem(props.walletName + '-password', props.encryptedMnemonics);
            goToNextStep()
        }
    };

    return (
        <AuthLayout><div className={cx("card")}>
            <div className={cx("card-header")}>Import Wallet
                <div className={cx("sub-card-header")}>Please copy and paste the mnemonic encryption below.</div>
            </div>
            <div className={cx("card-body")}>
                <div className={cx("mnemonics")}>
                    <div className={cx("mnemonics-field")}>
                        <div className={cx("field-title")}>Encrypted mnemonic pharse
                            <CopyToClipboard onCopy={copyToClipboard} text={props.encryptedMnemonics}>
                                <div className={cx("copy")}>
                                    <img className={cx("copy-image")} src={copyIcon} alt="" />
                                    <div className={cx("copy-btn")} >Copy</div>
                                </div>
                            </CopyToClipboard>
                        </div>
                        <div className={cx("field-input")}>
                            <textarea className={cx("text-field", "text-area")} defaultValue={props.encryptedMnemonics} disabled="disabled" placeholder="" />
                        </div>
                        {copied && <div className={cx("copy-message")}>Encrypted mnemonic phrase is copied.</div>}
                    </div>                    
                </div>

                <FormProvider {...methods} >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" className={cx("text-field-hidden")} name="account" value={props.walletName} placeholder="" {...importWallet("account", { required: true })} />
                        <Field
                            title="Encrypted mnemonic pharse"
                            input={<input type="password" className={cx("text-field")} name="mnemonics" autoComplete="new-password" placeholder="" {...importWallet("mnemonics", { required: true })} />}
                        />
                        {errors.mnemonics && <ErrorText>Invalid mnemonics.</ErrorText>}
                        {invalidMnemonics && <ErrorText>Encrypted mnemonic phrase does not match.</ErrorText>}

                        <a href="https://medium.com/cosmostation/introducing-keystation-end-to-end-encrypted-key-manager-for-dapps-built-with-the-cosmos-sdk-37dac753feb5" target="blank">
                            <Suggestion text="Why do I have to encrypt my mnemonic pharse?" />
                        </a>

                        <Button variant="primary" size="lg" submit={true}>
                            Next
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div></AuthLayout>
    );
};

EncryptedMnemonic.propTypes = {
};
EncryptedMnemonic.defaultProps = {};

export default EncryptedMnemonic;