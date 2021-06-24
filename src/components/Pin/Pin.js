import { React, useState } from "react";
import cn from "classnames/bind";
import _ from "lodash";
import { Close } from "@material-ui/icons";
import PropTypes from "prop-types";
import { getChildkeyFromDecrypted, encryptAES, decryptAES, anotherAppLogin, getChildkeyFromPrivateKey } from "src/utils";
import styles from "./Pin.module.scss";

const cx = cn.bind(styles);

const randomNumbers = _.shuffle(_.range(10));
const randomCharacters = _.shuffle(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);

const Pin = ({
    title,
    step,
    pinType,
    walletName,
    mnemonics,
    privateKey,
    encryptedPassword,
    formData,
    setStep,
    setEnteredPin,
    setEncryptedMnemonics,
    setEncryptedPrivateKey,
    onChildKey,
    closePin,
    setUser,
    setFormData,
    className
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
            pinType !== undefined && pinType !== "" ? evaluatePin() : handleSetNewPin();
        }
    };

    const evaluatePin = () => {
        const enteredPin = pinArray.join("");
        const decryptedPassword = decryptAES(encryptedPassword, enteredPin);

        if (decryptedPassword !== "") {
            if (pinType === "export-recovery-pharse") { 
                closePin && closePin(decryptedPassword);
                return;
            }

            const childKey = getChildKey(decryptedPassword);

            if (childKey !== "") {
                const address = cosmos.getAddress(childKey);
                console.log("pinData", { childKey, address });
                // const { privateKey } = childKey;
                // console.log('PRIVATE KEY', Buffer.from(privateKey).toString('hex'));

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
                        
                        localStorage.setItem(walletName + "-password", encryptedPassword);
                        
                        if (!_.isNil(window?.opener)) {
                            anotherAppLogin(address, walletName, childKey);
                            return;
                        }
                    } else if (pinType === "tx") {
                        onChildKey(childKey);
                    } else if (pinType === "confirm-encryted-mnemonics") {
                        setFormData(
                            Object.assign({}, formData, {
                                address: address,
                            })
                        );
                        nextStep();
                    }
                }, 300);

                return setEnteredPin && setEnteredPin(enteredPin);
            }
        }

        setTimeout(() => {
            setPinEvaluateStatus("error");
            setTimeout(() => {
                setPinEvaluateStatus("");
                setPinArray([]);
            }, 300);
        }, 200);
    };

    const getChildKey = (decryptedPassword) => {
        let childKey = "";
        try {
            childKey = getChildkeyFromDecrypted(decryptedPassword);
        } catch (e) {
            try {
                childKey = getChildkeyFromPrivateKey(decryptedPassword);
            } catch (e) {
                return "";
            }
        }
        return childKey;
    }

    const handleSetNewPin = () => {
        const enteredPin = pinArray.join("");
        setEncryptedPrivateKey && setEncryptedPrivateKey(encryptAES(privateKey, enteredPin));
        setEncryptedMnemonics && setEncryptedMnemonics(encryptAES(mnemonics, enteredPin));
        nextStep();
    }

    const NumPad = () => {
        const shuffledNumPad = [];

        for (let i = 0; i < 10; i++) {
            const num = randomNumbers[i];
            shuffledNumPad.push(
                <div className={cx("numpad-button")} key={num} onClick={() => onKeyClick(num)}>
                    {num}
                </div>
            );
            if (i === 8) {
                shuffledNumPad.push(
                    <div className={cx("numpad-button")} key="back" onClick={() => onKeyClick("back")}>
                        ←
                    </div>
                );
            }
        }
        shuffledNumPad.push(
            <div className={cx("numpad-button")} key="reset" onClick={() => onKeyClick("reset")}>
                <Close />
            </div>
        );

        return <div className={cx("numpad")}>{shuffledNumPad}</div>
    };

    const CharPad = () => {
        const rows = [];

        for (let i = 0; i < 26; i++) {
            const char = randomCharacters[i];
            rows.push(
                <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
                    {char}
                </div>
            );
            if (i === 20) {
                
            }
        }
        rows.push(
            <div className={cx("charpad-button")} key="back" onClick={() => onKeyClick("back")}>
                ←
            </div>
        );
        rows.push(
            <div className={cx("charpad-button")} key="reset" onClick={() => onKeyClick("reset")}>
                <Close />
            </div>
        );
        

        return <div className={cx("charpad")}> {rows} </div>;
    };

    return (
        <div className={cx("pin", className)}>
            <div className={cx("pin-header", "header")}>
                <div
                    className={cx("close-button")}
                    onClick={() => {
                        prevStep();
                        closePin && closePin();
                    }}
                >
                    <Close className={cx("close-button-icon")} />
                </div>
            </div>

            <div className={cx("pin-body")}>
                <div className={cx("title", "pin-body-title")}>{title}</div>
                <div className={cx("description", "pin-body-desc")}>PIN is required for every transaction.</div>
                <div className={cx("warning", "pin-body-warning")}>If lost, you cannot reset or recover your PIN.</div>

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
