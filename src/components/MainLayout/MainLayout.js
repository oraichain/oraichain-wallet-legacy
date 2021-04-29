import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import SearchIcon from "src/components/icons/SearchIcon";
import styles from "./MainLayout.module.scss";
import logoUrl from "src/images/logo.png";
import githubUrl from "src/images/github.png";
import enLanguageUrl from "src/images/en_language.png";
import vnLanguageUrl from "src/images/vn_language.png";

const cx = cn.bind(styles);

const MainLayout = ({ children }) => {
    return (
        <div className={cx("main-layout")}>
            <nav class="navbar navbar-expand-lg navbar-custom">
                <a class="navbar-brand" href="#">
                    <img src={logoUrl} className={cx("logo")} alt="" />
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <div >
                        <ul class="navbar-nav mr-auto">
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

                </div>
            </nav>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.any,
};
MainLayout.defaultProps = {};

export default MainLayout;
