import { React, useState } from "react";
import cn from "classnames/bind";
import { ArrowBack, Close } from "@material-ui/icons";
import PropTypes from "prop-types";
import _ from "lodash";
import { getChildkeyFromDecrypted, encryptAES, decryptAES, anotherAppLogin } from "src/utils";
import styles from "./Pin.module.scss";

const cx = cn.bind(styles);

const Pin = ({
    title,
    step,
    pinType,
    walletName,
    mnemonics,
    encryptedMnemonics,
    setStep,
    setEnteredPin,
    setEncryptedMnemonics,
    onChildKey,
    closePin,
    setUser,
    setEncryptedPrivateKey,
}) => {
    const cosmos = window.cosmos;

    let [pinArray, setPinArray] = useState([]);
    const [pinEvaluateStatus, setPinEvaluateStatus] = useState("");

    const nextStep = () => {
        setStep && setStep(step + 1);
    };

    const prevStep = () => {
        setStep && setStep(step - 1);
    };

    const onKeyClick = (key) => {
        switch (key) {
            case "back":
                pinArray.pop();
                setPinArray([...pinArray]);
                setPinEvaluateStatus("");
                break;
            case "reset":
                pinArray = [];
                setPinArray([]);
                setPinEvaluateStatus("");
                break;
            default:
                if (pinArray.length < 5) {
                    pinArray.push(key);
                    setPinArray([...pinArray]);
                }
        }

        if (pinArray.length === 5) {
            pinType === "confirm" || pinType === "signin" || pinType === "tx" ? evaluatePin() : encryptMnemonic();
        }
    };

    const evaluatePin = () => {
        const enteredPin = pinArray.join("");
        const decryptedMnemonics = decryptAES(encryptedMnemonics, enteredPin);
        if (decryptedMnemonics !== "") {
            setTimeout(() => {
                const childKey = getChildkeyFromDecrypted(decryptedMnemonics);
                const address = cosmos.getAddress(childKey);
                const {privateKey} = childKey;
                console.log('PRIVATE KEY', Buffer.from(privateKey).toString('hex'));

                setPinEvaluateStatus("success");
                setTimeout(() => {
                    if (pinType === "confirm") {
                        if (!_.isNil(window?.opener) && _.isNil(setStep)) {
                            anotherAppLogin(address, walletName, childKey);
                            return;
                        }

                        nextStep();
                    } else if (pinType === "signin") {
                        setUser &&
                            setUser({
                                address: address,
                                account: walletName,
                                childKey,
                            });

                        if (!_.isNil(window?.opener)) {
                            anotherAppLogin(address, walletName, childKey);
                            return;
                        }
                    } else if (pinType === "tx") {
                        onChildKey(childKey);
                    }
                }, 300);
            }, 200);
        } else {
            setTimeout(() => {
                setPinEvaluateStatus("error");
                setTimeout(() => {
                    setPinEvaluateStatus("");
                    setPinArray([]);
                }, 300);
            }, 200);
        }
        setEnteredPin?.(enteredPin);
    };

    const encryptMnemonic = () => {
        const enteredPin = pinArray.join("");
        if (pinType === "confirm-private-key") {
            setEncryptedPrivateKey && setEncryptedPrivateKey(encryptAES(mnemonics, enteredPin));
            return nextStep();
        }
        setEncryptedMnemonics(encryptAES(mnemonics, enteredPin));
        nextStep();
    };

    const NumPad = () => (
        <div className={cx("numpad")}>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(7)}>
                7
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(8)}>
                8
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(9)}>
                9
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(4)}>
                4
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(5)}>
                5
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(6)}>
                6
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(1)}>
                1
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(2)}>
                2
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(3)}>
                3
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick("back")}>
                <ArrowBack />
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick(0)}>
                0
            </div>
            <div className={cx("numpad-button")} onClick={() => onKeyClick("reset")}>
                <Close />
            </div>
        </div>
    );

    const CharPad = () => {
        const rows = [];

        rows.push(
            <div className={cx("charpad-row")} key="charpad-row-1">
                {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((char) => (
                    <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
                        {char}
                    </div>
                ))}
            </div>
        );

        rows.push(
            <div className={cx("charpad-row")} key="charpad-row-2">
                {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((char) => (
                    <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
                        {char}
                    </div>
                ))}
            </div>
        );

        rows.push(
            <div className={cx("charpad-row")} key="charpad-row-3">
                {["back", "Z", "X", "C", "V", "B", "N", "M", "reset"].map((char) => {
                    switch (char) {
                        case "back":
                            return (
                                <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick("back")}>
                                    <ArrowBack />
                                </div>
                            );
                        case "reset":
                            return (
                                <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick("reset")}>
                                    <Close />
                                </div>
                            );
                        default:
                            return (
                                <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
                                    {char}
                                </div>
                            );
                    }
                })}
            </div>
        );

        return <div className={cx("charpad")}> {rows} </div>;
    };

    return (
        <div className={cx("pin")}>
            <div className={cx("pin-header")}>
                <div
                    className={cx("close-button")}
                    onClick={() => {
                        prevStep();
                        closePin?.();
                    }}
                >
                    <Close className={cx("close-button-icon")} />
                </div>
            </div>

            <div className={cx("pin-body")}>
                <div className={cx("title")}>{title}</div>
                <div className={cx("description")}>PIN is required for every transaction.</div>
                <div className={cx("warning")}>If lost, you cannot reset or recover your PIN.</div>

                <div className={cx("confirmation-status")}>
                    <svg>
                        <g>
                            <circle
                                className={cx("circle", pinArray.length > 0 ? "entered" : "", pinEvaluateStatus)}
                                cx="10"
                                cy="10"
                                r="8"
                            ></circle>
                            <circle
                                className={cx("circle", pinArray.length > 1 ? "entered" : "", pinEvaluateStatus)}
                                cx="40"
                                cy="10"
                                r="8"
                            ></circle>
                            <circle
                                className={cx("circle", pinArray.length > 2 ? "entered" : "", pinEvaluateStatus)}
                                cx="70"
                                cy="10"
                                r="8"
                            ></circle>
                            <circle
                                className={cx("circle", pinArray.length > 3 ? "entered" : "", pinEvaluateStatus)}
                                cx="100"
                                cy="10"
                                r="8"
                            ></circle>
                            <circle
                                className={cx("circle", pinArray.length > 4 ? "entered" : "", pinEvaluateStatus)}
                                cx="130"
                                cy="10"
                                r="8"
                            ></circle>
                        </g>
                    </svg>
                </div>

                {pinArray.length < 4 ? <NumPad /> : <CharPad />}
            </div>
        </div>
    );
};

Pin.propTypes = {
    title: PropTypes.string,
};
Pin.defaultProps = {
    title: "Enter your PIN",
};

export default Pin;
