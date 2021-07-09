import React from "react";
import { Link, useHistory } from "react-router-dom";
import cn from "classnames/bind";
import _ from "lodash";
import PropTypes from "prop-types";
import BarsIcon from "src/components/icons/BarsIcon";
import logoUrl from "src/images/logo.png";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { pagePaths } from "src/consts/pagePaths";
import UserIcon from "src/components/icons/UserIcon";
import DownAngleIcon from "src/components/icons/DownAngleIcon";
import Wallet from "src/components/Wallet";
import styles from "./NavBar.module.scss";

const cx = cn.bind(styles);

const NavBar = ({ user, removeUser }) => {
    const history = useHistory();

    const toggleIcon = <BarsIcon className={cx("navbar-toggler-icon")} />;
    const navDropdownTitle = (
        <div className={cx("nav-dropdown-title")}>
            <UserIcon className={cx("user-icon")} />
            <DownAngleIcon className={cx("arrow-icon")} />
        </div>
    );

    return (
        <div className={cx("nav-bar")}>
            <div className={cx("logo-wrap")} onClick={() => history.push("/")}>
                <img src={logoUrl} className={cx("logo")} alt="" /> <span> Oraichain Wallet </span>
            </div>
            {!_.isNil(user) && 
                <div>
                    <NavDropdown title={navDropdownTitle} id="navbarScrollingDropdown" alignRight>
                        <Wallet user={user} removeUser={removeUser}/>
                    </NavDropdown>
                </div>
            }
            {/* <Navbar expand="lg">
                <Navbar.Brand to="/" as={Link}>
                    <img src={logoUrl} className={cx("logo")} alt="" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" children={toggleIcon} />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="w-100 justify-content-end">
                        {_.isNil(user) ? (
                            <Nav.Link as={Link} to={pagePaths.SIGNIN}>
                                Sigin
                            </Nav.Link>
                        ) : (
                            <NavDropdown title={navDropdownTitle} id="navbarScrollingDropdown" alignRight>
                                <Wallet user={user} removeUser={removeUser}/>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar> */}
        </div>
    );
};

NavBar.propTypes = {
    user: PropTypes.any,
    removeUser: PropTypes.func,
};
NavBar.defaultProps = {};

export default NavBar;
