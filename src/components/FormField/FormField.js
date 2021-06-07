import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./FormField.module.scss";
const cx = cn.bind(styles);

const FormField = ({children}) => {
    return <div className={cx("form-field")}>{children}</div>;
};

FormField.propTypes = {
    children: PropTypes.any
};
FormField.defaultProps = {};

export default FormField;
