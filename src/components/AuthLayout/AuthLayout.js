import React from "react";
import {useHistory } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./AuthLayout.module.scss";
import logoUrl from "src/images/logo.png";
import { pagePaths } from "src/consts/pagePaths";

const cx = cn.bind(styles);

const AuthLayout = ({ children }) => {
    const history = useHistory();

    return (
        <div className={cx("auth-layout")}>
            <div className={cx("auth-layout-header")}>
                <div className="container d-flex flex-row justify-content-start align-items-center">
                    <div className={cx("brand")} onClick={() => {
                        history.push(pagePaths.HOME);
                    }}>
                        <img className={cx("brand-icon")} src={logoUrl} alt="" />
                        <span className={cx("brand-text")}>Oraichain Wallet</span>
                    </div>
                </div>
            </div>
            <div className={cx("auth-layout-body")}>
                <div className="container">
                    {children}
                </div>
            </div>
        </div>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.any,
};

AuthLayout.defaultProps = {};

export default AuthLayout;
