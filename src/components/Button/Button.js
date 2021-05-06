import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./Button.module.scss";
const cx = cn.bind(styles);

const Button = ({ variant, size, children, onClick }) => {
    return (
        <div className={cx("button", "button-" + variant, "button-" + size)} onClick={() => {
            onClick && onClick();
        }}>
            {children}
        </div>);
};

Button.propTypes = {
    variant: PropTypes.string,
    size: PropTypes.string,
    children: PropTypes.any,
    onClick: PropTypes.func,
};
Button.defaultProps = {
    variant: "primary",
    size: "lg",
};

export default Button;
