import React, { useState } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { useToasts } from "react-toast-notifications";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import styles from "./MnemonicArea.module.scss";

// const message = Cosmos.message;
const cx = cn.bind(styles);

const MnemonicArea = ({ mnemonic }) => {
    const { addToast } = useToasts();

    const handleCopy = () => {
        window.navigator.clipboard.writeText(mnemonic);
        addToast("Copied!", {
            appearance: 'success',
            autoDismiss: true,
        });
    }

    const handleDownloadText = () => {
        const element = document.createElement("a");
        const file = new Blob([mnemonic], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "mnemonic.txt";
        document.body.appendChild(element);
        element.click();
    }

    return (
       <div className={cx("mnemonic-wrap")}>
           <div className={cx("title")}> Your private Secret Recovery Phrase </div>
           <div className={cx("content")}> { mnemonic } </div>
           <div className={cx("btn-group")}>
               <div className={cx("btn")} onClick={handleCopy}>
                    <FileCopyIcon /> <span> Copy to clipboard </span>
               </div>
               <div className={cx("btn")} onClick={handleDownloadText}>
                  <SaveAltIcon /> <span> Save as txt file </span>
               </div>
           </div>
       </div>
    );
};

MnemonicArea.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
MnemonicArea.defaultProps = {};

export default MnemonicArea;
