import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./ErrorText.module.scss";
const cx = cn.bind(styles);

const ErrorText = ({ children }) => {
    return <div className={cx("error-text")}>
        {children}
    </div>;
};

ErrorText.propTypes = {
    children: PropTypes.any
};
ErrorText.defaultProps = {};

export default ErrorText;
