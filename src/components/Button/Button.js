import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./Button.module.scss";
const cx = cn.bind(styles);

const Button = ({ type, group, variant, size, fitContent, children, onClick }) => {
    return (
        <button
            type={type}
            className={cx("button", "button-" + variant, group && "button-group-item", "button-" + size, { "button-fit-content": fitContent })}
            onClick={() => {
                onClick && onClick();
            }}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.string,
    group: PropTypes.bool,
    variant: PropTypes.string,
    size: PropTypes.string,
    children: PropTypes.any,
    onClick: PropTypes.func,
};
Button.defaultProps = {
    type: "button",
    group: false,
    variant: "primary",
    size: "lg",
    fitContent: false,
};

export default Button;
