import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./TextField.module.scss";
const cx = cn.bind(styles);

const TextField = ({type, variant, name, placeholder}) => {
    return <input className={cx("text-field", "text-field-" + variant)} type={type} name={name} placeholder={placeholder}/>;
};

TextField.propTypes = {
    type: PropTypes.string,
    variant: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string
};
TextField.defaultProps = {
    type: "text",
    variant: "light"
};

export default TextField;
