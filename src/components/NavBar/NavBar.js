import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames/bind";
import _ from "lodash";
import PropTypes from "prop-types";
import SearchIcon from "src/components/icons/SearchIcon";
import BarsIcon from "src/components/icons/BarsIcon";
import styles from "./NavBar.module.scss";
import logoUrl from "src/images/logo.png";
import githubUrl from "src/images/github.png";
import enLanguageUrl from "src/images/en_language.png";
import vnLanguageUrl from "src/images/vn_language.png";
import { Nav, Navbar } from "react-bootstrap";

const cx = cn.bind(styles);

const NavBar = ({ user }) => {
    const toggleContent = <BarsIcon className={cx("navbar-toggler-icon")} />;
    return (
        <div className={cx("nav-bar")}>
            <Navbar expand="lg">
                <Navbar.Brand to="/" as={Link}>
                    <img src={logoUrl} className={cx("logo")} alt="" />
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    children={toggleContent}
                />


                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className=" w-100 justify-content-end">
                        <li class="nav-item">
                            <div className={cx("search-button")}>
                                <SearchIcon className={cx("search-button-icon")} />
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <img className={cx("nav-link-icon")} src={githubUrl} alt="" />
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <img className={cx("nav-link-icon")} src={enLanguageUrl} alt="" />
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <img className={cx("nav-link-icon")} src={vnLanguageUrl} alt="" />
                            </a>
                        </li>
                        {(_.isNil(user) || Object.values(user).length === 0) && (
                            <li class="nav-item">
                                <Link class="nav-link" to="/signin">
                                    Sign in
                            </Link>
                            </li>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>

    );
};

NavBar.propTypes = {
    user: PropTypes.any,
};
NavBar.defaultProps = {};

export default NavBar;
