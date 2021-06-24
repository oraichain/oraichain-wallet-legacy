import React, { useState } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import MainLayout from "src/components/MainLayout";
import ModalExportMnemonic from "./ModalExportMnemonic";
import ModalExportPrivateKey from "./ModalExportPrivateKey";
import styles from "./Security.module.scss";
import Button from "src/components/Button";

const cx = cn.bind(styles);

const Security = ({ user, showAlertBox }) => {
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    
    const handleHideMnemonicModal = () => {
        setShowMnemonic(false);
    }

    const showMnemonicModal = () => {
        setShowMnemonic(true);
    }

    const handleHidePrivateKeyModal = () => {
        setShowPrivateKey(false);
    }

    const showPrivateKeyModal = () => {
        setShowPrivateKey(true);
    }
    
    return (
        <MainLayout pageTitle="Security & Privacy">
            <div className={cx("show-secret-key")}>
                <div className={cx("title")}> Reveal Secret Recovery Phrase </div>

                <div className={cx("button-group")}>
                    <Button variant="primary" group={true} fitContent={true} onClick={showMnemonicModal}> Reveal Mnemonics </Button>
                    <Button variant="primary" fitContent={true} onClick={showPrivateKeyModal}> Reveal Private Key </Button>
                </div>

                { showMnemonic && <ModalExportMnemonic show={showMnemonic} onHide={handleHideMnemonicModal} /> }

                {showPrivateKey && <ModalExportPrivateKey show={showPrivateKey} onHide={handleHidePrivateKeyModal} />}
            </div>

            {/* <div className={cx("show-secret-key")}>
                <div className={cx("title")}> Reveal Secret Recovery Phrase </div>
                <Button variant="primary" onClick={showMnemonicModal}> Reveal Secret Recovery Phrase </Button>
                <ModalExportMnemonic show={showMnemonic} onHide={handleHideMnemonicModal} />
            </div> */}
        </MainLayout>
    );
};

Security.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
Security.defaultProps = {};

export default Security;
