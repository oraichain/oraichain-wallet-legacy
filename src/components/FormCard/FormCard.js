import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./FormCard.module.scss";
const cx = cn.bind(styles);

const FormCard = ({ children }) => {
    return <div className={cx("form-card")}>{children}</div>;
};

FormCard.propTypes = {
    children: PropTypes.any
};
FormCard.defaultProps = {};

export default FormCard;
