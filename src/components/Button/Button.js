import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./Button.module.scss";
const cx = cn.bind(styles);

const Button = ({ submit, variant, size, children, onClick }) => {
    return (
        !submit ? (
            <div className={cx("button", "button-" + variant, "button-" + size)} onClick={() => {onClick && onClick()}} >
                {children}
            </div>
        ) : (
            <input type="submit" className={cx("button", "button-submit", "button-" + variant, "button-" + size)} value={children} />
        )
    )
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
