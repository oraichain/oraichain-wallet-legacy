import { React } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import _ from "lodash";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import illustrationImage from "src/assets/img/keychain.png";
import { getChildkeyFromDecrypted, decryptAES, anotherAppLogin,getChildkeyFromPrivateKey, getOraiAddressFromPrivateKey } from "../../utils";
import FormTitle from "src/components/FormTitle";
import styles from "./ConnectWallet.module.scss";
import { pagePaths } from "src/consts/pagePaths";

const cx = cn.bind(styles);

const ConnectWallet = ({ account, address, encryptedMnemonics, enteredPin, setUser, privateKey }) => {
    const history = useHistory();

    const connect = () => {
        let childKey;
        if (privateKey) {
            childKey = getChildkeyFromPrivateKey(privateKey);
            address = getOraiAddressFromPrivateKey(privateKey);
        } else {
            const decryptedMnemonics = decryptAES(encryptedMnemonics, enteredPin);
            childKey = getChildkeyFromDecrypted(decryptedMnemonics);
        }
        
        setUser({ address, account, childKey });

        if (_.isNil(window?.opener)) {
            history.push(pagePaths.HOME);
        } else {
            anotherAppLogin(address, account, childKey);
        }
    };

    return (
        <>
            <FormTitle>Import Wallet</FormTitle>
            <div className={cx("description")}>Save your Account to Keychain.</div>
            <div className="mb-3">
                <img className={cx("illustration")} src={illustrationImage} alt="" />
            </div>

            <Suggestion text='You MUST press "Save" in order to complete registration of your account. If this pop-up does not appear, please press the Key logo on the top right corner of your browser.' />
            <a href="https://support.google.com/chrome/answer/95606?co=GENIE.Platform%3DDesktop&hl=en" target="blank">
                How can I manage saved mnemonics?
            </a>

            <div className="mt-4">
                <Button variant="primary" size="lg" onClick={connect}>
                    Connect
                </Button>
            </div>
        </>
    );
};

ConnectWallet.propTypes = {};
ConnectWallet.defaultProps = {};

export default ConnectWallet;
