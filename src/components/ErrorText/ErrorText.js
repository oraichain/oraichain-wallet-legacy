import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import styles from "./ErrorText.module.scss";
const cx = cn.bind(styles);

const ErrorText = ({ className, children }) => {
    let customClassName = "";
    if (!_.isNil(className)) {
        customClassName = " " + className;
    }

    return <div className={cx("error-text") + customClassName}>{children}</div>;
};

ErrorText.propTypes = {
    children: PropTypes.any,
};
ErrorText.defaultProps = {};

export default ErrorText;
