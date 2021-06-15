import { React, useState, useRef } from "react";
import cn from "classnames/bind";
import _ from "lodash";
import { ArrowBack, Close } from "@material-ui/icons";
import PropTypes from "prop-types";
import { getChildkeyFromDecrypted, encryptAES, decryptAES, anotherAppLogin, getChildkeyFromPrivateKey } from "src/utils";
import styles from "./Pin.module.scss";
import { useEffect } from "react";

const cx = cn.bind(styles);

const randomNumbers = _.shuffle(_.range(10));
let indexNum = 0;

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
    decryptPwToMnemonic,
    setFormData,
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
            if (pinType === "decrypt-mnemonics") {
                decryptPwToMnemonic(decryptedPassword);
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

    const getRandomNum = () => {
        const num = randomNumbers[indexNum++];
        if (indexNum === 10) {
            indexNum = 0;
        }
        return (
            <div className={cx("numpad-button")} onClick={() => onKeyClick(num)}>
                {num}
            </div>
        );
    }

    const NumPad = () => (
        <div className={cx("numpad")}>
                {getRandomNum()}
                {getRandomNum()}
                {getRandomNum()}
                {getRandomNum()}
                {getRandomNum()}
                {getRandomNum()}
                {getRandomNum()}
                {getRandomNum()}
                {getRandomNum()}
                <div className={cx("numpad-button")} onClick={() => onKeyClick("back")}>
                    <ArrowBack />
                </div>
                {getRandomNum()}
                <div className={cx("numpad-button")} onClick={() => onKeyClick("reset")}>
                    <Close />
                </div>
            </div>
    );

    const CharPad = () => {
        const rows = [];

            ["Q", "W", "E", "R", "T", "Y"].forEach((char) => {
                rows.push(
                    <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
                        {char}
                    </div>
                );
            });
            ["Q", "W", "E", "R", "T", "Y"].forEach((char) => {
                rows.push(
                    <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
                        {char}
                    </div>
                );
            });
            ["Q", "W", "E", "R", "T", "Y"].forEach((char) => {
                rows.push(
                    <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
                        {char}
                    </div>
                );
            });
            ["Q", "W", "E", "R", "T", "Y"].forEach((char) => {
                rows.push(
                    <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
                        {char}
                    </div>
                );
            });

           

        // rows.push(
        //     <div className={cx("charpad-row")} key="charpad-row-2">
        //         {["A", "S", "D", "F", "G", "H", "J"].map((char) => (
        //             <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
        //                 {char}
        //             </div>
        //         ))}
        //     </div>
        // );

        // rows.push(
        //     <div className={cx("charpad-row")} key="charpad-row-2">
        //         {["A", "S", "D", "F", "G", "H", "J"].map((char) => (
        //             <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
        //                 {char}
        //             </div>
        //         ))}
        //     </div>
        // );

        // rows.push(
        //     <div className={cx("charpad-row")} key="charpad-row-2">
        //         {["A", "S", "D", "F", "G", "H", "J"].map((char) => (
        //             <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
        //                 {char}
        //             </div>
        //         ))}
        //     </div>
        // );

        // rows.push(
        //     <div className={cx("charpad-row")} key="charpad-row-3">
        //         {["back", "Z", "X", "C", "V", "B", "N", "M", "reset"].map((char) => {
        //             switch (char) {
        //                 case "back":
        //                     return (
        //                         <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick("back")}>
        //                             <ArrowBack />
        //                         </div>
        //                     );
        //                 case "reset":
        //                     return (
        //                         <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick("reset")}>
        //                             <Close />
        //                         </div>
        //                     );
        //                 default:
        //                     return (
        //                         <div className={cx("charpad-button")} key={char} onClick={() => onKeyClick(char)}>
        //                             {char}
        //                         </div>
        //                     );
        //             }
        //         })}
        //     </div>
        // );

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
