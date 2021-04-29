import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./AuthLayout.module.scss";
const cx = cn.bind(styles);

const AuthLayout = ({ children }) => {
    return (
        <div className={cx("auth-layout")}>
        {children}
    </div>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.any,
};

AuthLayout.defaultProps = {};

export default AuthLayout;
