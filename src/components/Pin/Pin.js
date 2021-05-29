import { React, useState } from "react";
import cn from "classnames/bind";
import { ArrowBack, Close } from "@material-ui/icons";
import PropTypes from "prop-types";
import _ from "lodash";
import styles from "./Pin.module.scss";
// import { useHistory } from "react-router";
// import { useTranslation } from "react-i18next";
import { getChildkeyFromDecrypted, encryptAES, decryptAES } from "src/utils";

const cx = cn.bind(styles);

const Pin = ({
    message,
    currentStep,
    pinType,
    walletName,
    mnemonics,
    encryptedMnemonics,
    footerElement,
    setStep,
    setEnteredPin,
    setEncryptedMnemonics,
    onChildKey,
    closePin,
    setUser,
    anotherAppLogin,
    loggedInAccount,
    loggedInAddress,
}) => {
    // const history = useHistory();
    // const { t, i18n } = useTranslation();
    const cosmos = window.cosmos;

    let [pinArray, setPinArray] = useState([]);
    const [pinEvaluateStatus, setPinEvaluateStatus] = useState("");

    const goToNextStep = () => {
        setStep && setStep(currentStep + 1);
    };

    const goToPrevStep = () => {
        setStep && setStep(currentStep - 1);
    };

    const handleClick = (e) => {
        switch (e) {
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
                    pinArray.push(e);
                    setPinArray([...pinArray]);
                }
        }

        if (pinArray.length === 5) {
            pinType === "confirm" || pinType === "signin" || pinType === "tx"
                ? evaluatePin()
                : encryptMnemonic();
        }
    };

    const evaluatePin = () => {
        const enteredPin = pinArray.join("");
        const decryptedMnemonics = decryptAES(encryptedMnemonics, enteredPin);
        if (decryptedMnemonics !== "") {
            setTimeout(() => {
                const childKey = getChildkeyFromDecrypted(decryptedMnemonics);
                const address = cosmos.getAddress(childKey);
                setPinEvaluateStatus("success");
                setTimeout(() => {
                    if (pinType === "confirm") {
                        if (!_.isNil(anotherAppLogin)) {
                            anotherAppLogin(
                                address ?? loggedInAddress,
                                walletName ?? loggedInAccount,
                                childKey
                            );
                            return;
                        }

                        goToNextStep();
                    } else if (pinType === "signin") {
                        setUser &&
                            setUser({
                                address: address,
                                account: walletName,
                                childKey,
                            });

                        if (!_.isNil(anotherAppLogin)) {
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
        setEncryptedMnemonics(encryptAES(mnemonics, enteredPin));
        goToNextStep();
    };

    const NumPad = () => (
        <div className={cx("numpad")}>
            <div className={cx("numpad-button")} onClick={() => handleClick(7)}>
                7
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(8)}>
                8
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(9)}>
                9
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(4)}>
                4
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(5)}>
                5
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(6)}>
                6
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(1)}>
                1
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(2)}>
                2
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(3)}>
                3
            </div>
            <div
                className={cx("numpad-button")}
                onClick={() => handleClick("back")}
            >
                <ArrowBack />
            </div>
            <div className={cx("numpad-button")} onClick={() => handleClick(0)}>
                0
            </div>
            <div
                className={cx("numpad-button")}
                onClick={() => handleClick("reset")}
            >
                <Close />
            </div>
        </div>
    );

    const CharPad = () => {
        const rows = [];

        rows.push(
            <div className={cx("charpad-row")} key="charpad-row-1">
                {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
                    (char) => (
                        <div
                            className={cx("charpad-button")}
                            key={char}
                            onClick={() => handleClick(char)}
                        >
                            {char}
                        </div>
                    )
                )}
            </div>
        );

        rows.push(
            <div className={cx("charpad-row")} key="charpad-row-2">
                {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((char) => (
                    <div
                        className={cx("charpad-button")}
                        key={char}
                        onClick={() => handleClick(char)}
                    >
                        {char}
                    </div>
                ))}
            </div>
        );

        rows.push(
            <div className={cx("charpad-row")} key="charpad-row-3">
                {["back", "Z", "X", "C", "V", "B", "N", "M", "reset"].map(
                    (char) => {
                        switch (char) {
                            case "back":
                                return (
                                    <div
                                        className={cx("charpad-button")}
                                        key={char}
                                        onClick={() => handleClick("back")}
                                    >
                                        <ArrowBack />
                                    </div>
                                );
                            case "reset":
                                return (
                                    <div
                                        className={cx("charpad-button")}
                                        key={char}
                                        onClick={() => handleClick("reset")}
                                    >
                                        <Close />
                                    </div>
                                );
                            default:
                                return (
                                    <div
                                        className={cx("charpad-button")}
                                        key={char}
                                        onClick={() => handleClick(char)}
                                    >
                                        {char}
                                    </div>
                                );
                        }
                    }
                )}
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
                        goToPrevStep();
                        closePin?.();
                    }}
                >
                    <Close className={cx("close-button-icon")} />
                </div>
            </div>

            <div className={cx("pin-body")}>
                <div className={cx("title")}>{message}</div>
                <div className={cx("description")}>
                    PIN is required for every transaction.
                </div>
                <div className={cx("warning")}>
                    If lost, you cannot reset or recover your PIN.
                </div>
            </div>

            <div className={cx("confirmation-status")}>
                <svg>
                    <g>
                        <circle
                            className={cx(
                                "circle",
                                pinArray.length > 0 ? "entered" : "",
                                pinEvaluateStatus
                            )}
                            cx="10"
                            cy="10"
                            r="8"
                        ></circle>
                        <circle
                            className={cx(
                                "circle",
                                pinArray.length > 1 ? "entered" : "",
                                pinEvaluateStatus
                            )}
                            cx="40"
                            cy="10"
                            r="8"
                        ></circle>
                        <circle
                            className={cx(
                                "circle",
                                pinArray.length > 2 ? "entered" : "",
                                pinEvaluateStatus
                            )}
                            cx="70"
                            cy="10"
                            r="8"
                        ></circle>
                        <circle
                            className={cx(
                                "circle",
                                pinArray.length > 3 ? "entered" : "",
                                pinEvaluateStatus
                            )}
                            cx="100"
                            cy="10"
                            r="8"
                        ></circle>
                        <circle
                            className={cx(
                                "circle",
                                pinArray.length > 4 ? "entered" : "",
                                pinEvaluateStatus
                            )}
                            cx="130"
                            cy="10"
                            r="8"
                        ></circle>
                    </g>
                </svg>
            </div>

            {pinArray.length < 4 ? <NumPad /> : <CharPad />}

            {!_.isNil(footerElement) && footerElement}
        </div>
    );
};

Pin.propTypes = {
    message: PropTypes.string,
};
Pin.defaultProps = {
    message: "Enter your PIN",
};

export default Pin;
