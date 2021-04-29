import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./TextField.module.scss";
const cx = cn.bind(styles);

const Input = ({type, variant, name, placeholder}) => {
    return <input className={cx("text-field", "text-field-" + variant)} type="text" name={name} placeholder={placeholder}/>;
};

Input.propTypes = {
    type: PropTypes.string,
    variant: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string
};
Input.defaultProps = {
    type: "text",
    variant: "line"
};

export default Input;
