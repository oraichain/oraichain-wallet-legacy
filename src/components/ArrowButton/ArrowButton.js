import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./ArrowButton.module.scss";
import RightArrowIcon from "../icons/RightArrowIcon";
const cx = cn.bind(styles);

const ArrowButton = ({ type, children, onClick }) => {
    return (
        <button
            type={type}
            className={cx("arrow-button")}
            onClick={() => {
                onClick && onClick();
            }}
        >
            <span className={cx("arrow-button-text")}>{children}</span>
            <RightArrowIcon className={cx("arrow-button-icon")} />
        </button>
    );
};

ArrowButton.propTypes = {
    type: PropTypes.string,
    children: PropTypes.any,
    onClick: PropTypes.func,
};
ArrowButton.defaultProps = {
    type: "button",
};

export default ArrowButton;
