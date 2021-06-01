import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./ArrowButton.module.scss";
import RightArrowIcon from "../icons/RightArrowIcon";
const cx = cn.bind(styles);

const ArrowButton = ({ type, children }) => {
    return (
        <button type={type} className={cx("arrow-button")}>
            <span className={cx("arrow-button-text")}>{children}</span>
            <RightArrowIcon className={cx("arrow-button-icon")} />
        </button>
    );
};

ArrowButton.propTypes = {
    type: PropTypes.string,
    children: PropTypes.any,
};
ArrowButton.defaultProps = {
    type: "button"
};

export default ArrowButton;
