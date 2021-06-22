import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from 'react-redux';
import WarningIcon from '@material-ui/icons/Warning';

import Pin from "src/components/Pin";
import MnemonicArea from "./MnemonicArea";
import styles from "./ModalExportMnemonic.module.scss";

// const message = Cosmos.message;
const cx = cn.bind(styles);

const ModalExportMnemonic = (props) => {
    const [encryptedMnemonics, setEncryptedMnemonics] = useState();
    const user = useSelector((state) => state.user);
    const [showPin, setShowPin] = useState(true);
    const [decryptedMnemonics, setDecryptedMnemonics] = useState(false);

    const decryptPwToMnemonic = (mnemonics) => {
        setDecryptedMnemonics(mnemonics);
        setShowPin(false);
    }

    useEffect(() => {
        const getMnemonicFromStorage = () => {
            const storageKey = user.account + "-password";
            if (storageKey !== "") {
                setEncryptedMnemonics(localStorage.getItem(storageKey));
            }
        }
        getMnemonicFromStorage();

    }, [])

    return (
        <Modal {...props} centered size="md" aria-labelledby="contained-modal-title-vcenter" className={cx("mnemonic-modal")}>
            <Modal.Header closeButton>
                <Modal.Title> Reveal Secret Recovery Phrase </Modal.Title>
            </Modal.Header>
            <Modal.Body className={cx("modal-body")}> 
                <div> If you ever change browsers or move computers, you will need this Secret Recovery Phrase to access your accounts.
                    Save them somewhere safe and secret. </div>
                <div className={cx("warning")}> <WarningIcon /> <span> DO NOT share this phrase with anyone!
                        These words can be used to steal all your accounts. </span></div> 
                {showPin &&
                <>
                    <div className={cx("pin-title")}> Enter PIN to continue </div>
                    <div className={cx("pin")}>
                        <Pin
                            className={cx("pin-custom")}
                            title="Enter your PIN"
                            pinType="decrypt-mnemonics"
                            closePin={decryptPwToMnemonic}
                            encryptedPassword={encryptedMnemonics}
                        />
                    </div>
                </>
                }
                {decryptedMnemonics && <MnemonicArea mnemonic={decryptedMnemonics} />}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
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
