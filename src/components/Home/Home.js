import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import MainLayout from "src/components/MainLayout";
import styles from "./Home.module.scss";

const cx = cn.bind(styles);

const Home = () => {
    return (
        <MainLayout>
            <div className={cx("home")}></div>
        </MainLayout>
    );
};

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
