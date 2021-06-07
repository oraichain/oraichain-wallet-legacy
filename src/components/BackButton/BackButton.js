import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./BackButton.module.scss";
import LeftArrowIcon from "../icons/LeftArrowIcon";
const cx = cn.bind(styles);

const BackButton = ({ children, onClick }) => {
    return (
        <button className={cx("back-button")} onClick={() => {
            onClick && onClick();
        }}>
            <LeftArrowIcon className={cx("back-button-icon")} />
            <span className={cx("back-button-text")}>{children}</span>
        </button>
    );
};

BackButton.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func,
};
BackButton.defaultProps = {
};

export default BackButton;
