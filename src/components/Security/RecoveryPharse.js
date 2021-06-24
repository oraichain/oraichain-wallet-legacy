import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { useToasts } from "react-toast-notifications";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import styles from "./RecoveryPharse.module.scss";

const cx = cn.bind(styles);

const RecoveryPharse = ({ recoveryPharse, isMnemonic }) => {
    const { addToast } = useToasts();

    const handleCopy = () => {
        window.navigator.clipboard.writeText(recoveryPharse);
        addToast("Copied!", {
            appearance: 'success',
            autoDismiss: true,
        });
    }

    const handleDownloadText = () => {
        const element = document.createElement("a");
        const file = new Blob([recoveryPharse], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = isMnemonic ? "mnemonic.txt" : "private-key.txt";
        document.body.appendChild(element);
        element.click();
    }

    return (
       <div className={cx("recovery-wrap")}>
           <div className={cx("title")}> Your private Secret Recovery Phrase </div>
           <div className={cx("content")}> { recoveryPharse } </div>
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

RecoveryPharse.propTypes = {
    user: PropTypes.any,
    showAlertBox: PropTypes.func,
};
RecoveryPharse.defaultProps = {};

export default RecoveryPharse;
