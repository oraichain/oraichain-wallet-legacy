import { React } from "react";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./ConnectWallet.module.scss";
import AuthLayout from "../AuthLayout";
import keyChain from "src/assets/img/keychain.png";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";

const cx = cn.bind(styles);

const ConnectWallet = ({ account, address, closePopup }) => {
    const history = useHistory();
    const { t, i18n } = useTranslation();

    const methods = useForm();

    const onSubmit = (data) => {
    };

    const sendEventToParent = () => {
        if (closePopup) {
            window.opener.postMessage({ address: address, account: account }, "*");
            window.close();
        } else {
            history.push(`/${i18n.language}/`);
        }
    }

    return (
        <AuthLayout><div className={cx("card")}>
            <div className={cx("card-header")}>Import Wallet
                <div className={cx("sub-card-header")}>Save your Account to Keychain.</div>
            </div>
            <div className={cx("card-body")}>
                <FormProvider {...methods} >
                    <form onSubmit={onSubmit}>
                        <img className={cx("keychain-image")} src={keyChain} alt="" />
                        <Suggestion text='You MUST press "Save" in order to complete registration of your account. If this pop-up does not appear, please press the Key logo on the top right corner of your browser.' />
                        <a href="https://support.google.com/chrome/answer/95606?co=GENIE.Platform%3DDesktop&hl=en" target="blank">
                            How can I manage saved mnemonics?
                        </a>
                        
                        <Button variant="primary" size="lg" onClick={sendEventToParent}>
                            Connect
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div></AuthLayout>
    );
};

ConnectWallet.propTypes = {
};
ConnectWallet.defaultProps = {};

export default ConnectWallet;