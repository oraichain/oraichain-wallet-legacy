import React from "react";
import cn from "classnames/bind";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

import { selectUser, removeUser } from "src/store/slices/userSlice";
import Wallet from "src/components/Wallet";
import UserIcon from "src/components/icons/UserIcon";
import DownAngleIcon from "src/components/icons/DownAngleIcon";
import logoUrl from "src/images/orai_wallet_logo.png";

import styles from "./AuthLayout.module.scss";

const cx = cn.bind(styles);

const AuthLayout = ({ children }) => {

    const history = useHistory();
    const user = useSelector(state => selectUser(state));
    const dispatch = useDispatch();
    const handleRemoveUser = () => dispatch(removeUser());

    const navDropdownTitle = (
        <div className={cx("nav-dropdown-title")}>
            <UserIcon className={cx("user-icon")} />
            <DownAngleIcon className={cx("arrow-icon")} />
        </div>
    );

    return (
        <div className={cx("auth-layout")}>
            <div className={cx("auth-layout-header")}>
                <div className={cx("header-wallet")}>
                    <div className={cx("brand")}>
                        <img className={cx("brand-icon")} src={logoUrl} alt="" />
                        <span className={cx("brand-text")} onClick={() => history.push("/")}>Oraichain Wallet</span>
                    </div>
                    {!_.isNil(user) &&
                        <div>
                            <NavDropdown title={navDropdownTitle} id="navbarScrollingDropdown" alignRight>
                                <Wallet user={user} removeUser={handleRemoveUser} />
                            </NavDropdown>
                        </div>
                    }
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
