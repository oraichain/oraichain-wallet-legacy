import React, { useState } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { Button } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import ReactJson from "react-json-view";
import KSUID from "ksuid";
import Cosmos from "@oraichain/cosmosjs";
import bech32 from "bech32";
import Long from "long";
import MainLayout from "src/components/MainLayout";
import FormCard from "src/components/FormCard";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import ErrorText from "src/components/ErrorText";
import ArrowButton from "src/components/ArrowButton";
import Loading from "src/components/Loading";
import ButtonGroup from "src/components/ButtonGroup";
import BackButton from "src/components/BackButton";
import PreviewButton from "src/components/PreviewButton";
import ModalExportMnemonic from "./ModalExportMnemonic";
import styles from "./Security.module.scss";

// const message = Cosmos.message;
const cx = cn.bind(styles);

const Security = ({ user, showAlertBox }) => {
    const [showMnemonic, setShowMnemonic] = useState(false);
    

    const handleHideMnemonicModal = () => {
        setShowMnemonic(false);
    }

    const showMnemonicModal = () => {
        setShowMnemonic(true);
    }
    
    return (
        <MainLayout pageTitle="Security & Privacy">
            <div className={cx("show-secret-key")}>
                <div className={cx("title")}> Reveal Secret Recovery Phrase </div>
                <Button variant="primary" onClick={showMnemonicModal}> Reveal Secret Recovery Phrase </Button>
                { showMnemonic && <ModalExportMnemonic show={showMnemonic} onHide={handleHideMnemonicModal} /> }
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
