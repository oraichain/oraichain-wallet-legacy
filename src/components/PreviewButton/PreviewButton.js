import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import  ExpandFromCornerIcon from "src/components/icons/ExpandFromCornerIcon";
import styles from "./PreviewButton.module.scss";


const cx = cn.bind(styles);

const PreviewButton = ({ children, onClick }) => {
    return (
        <button className={cx("preview-button")} onClick={() => {
            onClick && onClick();
        }}>
            <ExpandFromCornerIcon className={cx("preview-button-icon")} />
            <span className={cx("preview-button-text")}>{children}</span>
        </button>
    );
};

PreviewButton.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func,
};
PreviewButton.defaultProps = {};

export default PreviewButton;
