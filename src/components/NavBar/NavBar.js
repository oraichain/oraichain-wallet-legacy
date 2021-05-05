import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import SearchIcon from "src/components/icons/SearchIcon";
import BarsIcon from "src/components/icons/BarsIcon";
import styles from "./NavBar.module.scss";
import logoUrl from "src/images/logo.png";
import githubUrl from "src/images/github.png";
import enLanguageUrl from "src/images/en_language.png";
import vnLanguageUrl from "src/images/vn_language.png";

const cx = cn.bind(styles);

const NavBar = () => {
    return (
        <nav class="navbar navbar-expand-lg main-layout-navbar">
            <a class="navbar-brand" href="#">
                <img src={logoUrl} className={cx("logo")} alt="" />
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <BarsIcon className={cx("navbar-toggler-icon")} />
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <div className={cx("search-button")}>
                            <SearchIcon className={cx("search-button-icon")} />
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><img className={cx("nav-link-icon")} src={githubUrl} alt="" /></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><img className={cx("nav-link-icon")} src={enLanguageUrl} alt="" /></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"><img className={cx("nav-link-icon")} src={vnLanguageUrl} alt="" /></a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

NavBar.propTypes = {};
NavBar.defaultProps = {};

export default NavBar;
