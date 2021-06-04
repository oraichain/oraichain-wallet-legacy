import React from "react";
import { connect } from "react-redux";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { showAlertBox } from "src/store/slices/alertSlice";
import CopyIcon from "src/components/icons/CopyIcon";
import styles from "./CopyButton.module.scss";

const cx = cn.bind(styles);

const mapDispatchToProps = (dispatch) => ({
    showAlertBox: (payload) => dispatch(showAlertBox(payload)),
});

const CopyButton = ({ text, showAlertBox }) => {
    return (
        <CopyToClipboard onCopy={() => {
            showAlertBox({
                variant: "success",
                duration: 500,
                message: "Copied",
            });
        }} text={text}>
            <button
                type="button"
                className={cx("copy-button")}
            >
                <CopyIcon className={cx("copy-button-icon")} />
            </button>
        </CopyToClipboard>
    );
};

CopyButton.propTypes = {
    text: PropTypes.string,
    showAlertBox: PropTypes.func,
};
CopyButton.defaultProps = {};

export default connect(null, mapDispatchToProps)(CopyButton);
