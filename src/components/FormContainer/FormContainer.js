import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./FormContainer.module.scss";
const cx = cn.bind(styles);

const FormContainer = ({ children }) => {
    return <div className={cx("auth-container")}>{children}</div>;
};

FormContainer.propTypes = {};
FormContainer.defaultProps = {};

export default FormContainer;
