import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import cn from "classnames/bind";
import _ from "lodash";
import { pagePaths } from "src/consts/pagePaths";
import MainLayout from "src/components/MainLayout";
import styles from "./Home.module.scss";

const cx = cn.bind(styles);

const Home = () => {
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (!_.isNil(window?.opener)) {
            history.push({
                pathname: pagePaths.AUTH,
                search: location.search
            });
        }
    }, []);

    return (
        <MainLayout>
            <div className={cx("home")}></div>
        </MainLayout>
    );
};

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
