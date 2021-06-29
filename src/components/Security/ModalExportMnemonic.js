import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { Modal } from "react-bootstrap";
import { useSelector } from 'react-redux';
import WarningIcon from '@material-ui/icons/Warning';
import SmsFailedIcon from '@material-ui/icons/SmsFailed';
import Button from "src/components/Button";
import Pin from "src/components/Pin";
import RecoveryPharse from "src/components/Security/RecoveryPharse";
import { isMnemonicsValid } from "src/utils";
import styles from "./ModalExportRecoveryPharse.module.scss";

const cx = cn.bind(styles);

const ModalExportMnemonic = (props) => {
    const [encryptedPassword, setEncryptedPassword] = useState();
    const [decryptedMnemonics, setDecryptedMnemonics] = useState();
    const user = useSelector((state) => state.user);
    const [showPin, setShowPin] = useState(true);

    const decryptPwToMnemonic = (mnemonics) => {
        setDecryptedMnemonics(mnemonics);
        setShowPin(false);
    }

    useEffect(() => {
        const getMnemonicFromStorage = () => {
            const storageKey = user.account + "-password";
            setEncryptedPassword(localStorage.getItem(storageKey));
        }
        getMnemonicFromStorage();
    }, [])

    return (
        <Modal {...props} centered size="md" aria-labelledby="contained-modal-title-vcenter" className={cx("mnemonic-modal")}>
            <Modal.Header className={cx("modal-header")} closeButton>
                <Modal.Title> Reveal Mnemonic Phrase </Modal.Title>
            </Modal.Header>
            <Modal.Body className={cx("modal-body")}>
                <div className={cx("recovery")}>
                    <div className={cx("recovery-title")}>
                        If you ever change browsers or move computers, you will need this phrase to access your accounts.
                        Save them somewhere safe and secret.
                    </div>
                    <div className={cx("recovery-warning")}>
                        <WarningIcon />
                        <span> DO NOT share this phrase with anyone! These words can be used to steal all your accounts.</span>
                    </div>
                </div>
                {showPin &&
                    <>
                        <div className={cx("pin-title")}> Enter PIN to continue </div>
                        <div className={cx("pin")}>
                            <Pin
                                className={cx("pin-custom")}
                                title="Enter your PIN"
                                pinType="export-recovery-pharse"
                                closePin={decryptPwToMnemonic}
                                encryptedPassword={encryptedPassword}
                            />
                        </div>
                    </>
                }
                {decryptedMnemonics && (isMnemonicsValid(decryptedMnemonics) ? (
                    <RecoveryPharse recoveryPharse={decryptedMnemonics} isMnemonic={true} />
                ) : (
                    <div className={cx("invalid-mnemonic")}>
                        <SmsFailedIcon />
                        <span>Unable to decrypt to a suitable mnemonic</span>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer className={cx("modal-footer")}>
                <Button variant="secondary" fitContent={true} size="sm" onClick={props.onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ModalExportMnemonic.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
ModalExportMnemonic.defaultProps = {};

export default ModalExportMnemonic;
