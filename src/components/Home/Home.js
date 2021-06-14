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
    const [showPin, setShowPin] = useState(false);
    const [enteredPin, setEnteredPin] = useState();

    useEffect(() => {
        if (!_.isNil(window?.opener)) {
            history.push({
                pathname: pagePaths.AUTH,
                search: location.search
            });
        }
    }, []);

    const exportPrivateKey = () => {
        const { privateKey } = user.childKey;
        const privateKeyStr = Buffer.from(privateKey).toString("hex");
        setPrivateKey(privateKeyStr);
    }

    const decryptPwToMnemonic = () => {
        const storageKey = user.account + "-password";
        setShowPin(true);
        console.log(localStorage.getItem(storageKey))
    }

    const handleEnterPin = (pin) => {
        console.log(pin)
        setShowPin(false);
        setEnteredPin(pin);
    }

    return (
        <MainLayout>
            <div className={cx("home")}></div>
            <button onClick={exportPrivateKey}> Export Private Key </button>
            { privateKey && <div className={cx("private-key")}> {privateKey} </div>}


            <button onClick={decryptPwToMnemonic}> Decrypt Password to Mnemonic </button>
            { privateKey && <div className={cx("private-key")}> {privateKey} </div>}

            {
                showPin &&
                <Pin
                    type="enter-pin"
                    message="Please confirm your PIN"
                    pinType="confirm"
                    setEnteredPin={handleEnterPin}
                />
            }
        </MainLayout>
    );
};

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
