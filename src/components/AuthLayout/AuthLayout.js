import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./AuthLayout.module.scss";
import logoUrl from "src/images/logo.png";

const cx = cn.bind(styles);

const AuthLayout = ({ children }) => {
    return (
        <div className={cx("auth-layout")}>
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-12 col-lg-6 h-100 d-none d-lg-block">
                        <div className={cx("auth-layout-header")}>
                            <div className={cx("brand")}>
                                <img className={cx("brand-logo")} src={logoUrl} alt="" />
                                <span className={cx("brand-name")}>Oraichain Wallet</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 h-100">
                        <div className={cx("auth-layout-body")}>{children}</div>
                    </div>
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
