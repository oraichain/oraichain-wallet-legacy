import { React, useState } from "react";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./EncryptedMnemonic.module.scss";
import AuthLayout from "../AuthLayout";
import copyIcon from "src/assets/icons/copy.svg";
import ErrorText from "../ErrorText";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Field from "../Field";

const cx = cn.bind(styles);

const EncryptedMnemonic = (props) => {
    const methods = useForm();
    const { register:importWallet, handleSubmit, formState: { errors } } = methods;

    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    };

    const onSubmit = () => {
        // to do
    };

    return (
        <AuthLayout><div className={cx("card")}>
            <div className={cx("card-header")}>Import Wallet
                <div className={cx("sub-card-header")}>Please copy and paste the mnemonic encryption below.</div>
            </div>
            <div className={cx("card-body")}>
                <div className={cx("mnemonics")}>
                    <Field
                        title="Encrypted mnemonic pharse"
                        input={<textarea className={cx("text-field", "text-area")} defaultValue={props.encryptedMnemonics} disabled="disabled" name="mnemonics" placeholder="" />}
                    />
                    
                    {copied && <div className={cx("copy-message")}>Encrypted mnemonic phrase is copied.</div>}
                    <CopyToClipboard onCopy={copyToClipboard} text={props.encryptedMnemonics}>
                        <div className={cx("copy")}>
                            <img className={cx("copy-image")} src={copyIcon} alt="" />
                            <span className={cx("copy-btn")} >Copy</span>
                        </div>
                    </CopyToClipboard>
                </div>

                <FormProvider {...methods} >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Field
                            title="Encrypted mnemonic pharse"
                            input={<input type="password" className={cx("text-field")} name="encryptedMnemonics" placeholder="" {...importWallet("encryptedMnemonics", { required: true })} />}
                        />
                        {(errors.encryptedMnemonics) && <ErrorText>Invalid account.</ErrorText>}
                        
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