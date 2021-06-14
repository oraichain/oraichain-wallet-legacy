import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import Pin from "src/components/Pin";
import _ from "lodash";
import { pagePaths } from "src/consts/pagePaths";
import MainLayout from "src/components/MainLayout";
import styles from "./Home.module.scss";

const cx = cn.bind(styles);

const Home = () => {
    const history = useHistory();
    const location = useLocation();
    const user = useSelector((state) => state.user);
    const [privateKey, setPrivateKey] = useState();
    const [mnemonics, setMnemonics] = useState();
    const [encryptedMnemonics, setEncryptedMnemonics] = useState();
    const [showPin, setShowPin] = useState(false);
    // const [enteredPin, setEnteredPin] = useState();

    useEffect(() => {
        if (!_.isNil(window?.opener)) {
            history.push({
                pathname: pagePaths.AUTH,
                search: location.search
            });
        }
    }, []);

    const exportPrivateKey = () => {
        const { __D } = user.childKey;
        const privateKeyStr = Buffer.from(__D).toString("hex");
        setPrivateKey(privateKeyStr);
    }

    const getMnemonicFromStorage = () => {
        const storageKey = user.account + "-password";
        console.log(localStorage.getItem(storageKey));
        if (storageKey !== "") {
            setEncryptedMnemonics(localStorage.getItem(storageKey));
            setShowPin(true);
        }
    }

    const decryptPwToMnemonic = (mnemonics) => {
        setShowPin(false);
        setMnemonics(mnemonics);
    }

    return (
        <MainLayout>
            <div className={cx("home")}></div>
            <button onClick={exportPrivateKey}> Export Private Key </button>
            {privateKey && <div className={cx("private-key")}> Your private key: {privateKey} </div>}

            <button onClick={getMnemonicFromStorage}> Decrypt Password to Mnemonic </button>
            {mnemonics && <div className={cx("mnemonic")}> Your mnemonic: {mnemonics} </div>}

            {
                showPin &&
                <Pin
                    title="Enter your PIN"
                    pinType="decrypt-mnemonics"
                    encryptedPassword={encryptedMnemonics}
                    decryptPwToMnemonic={decryptPwToMnemonic}
                />
            }
        </MainLayout>
    );
};

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
