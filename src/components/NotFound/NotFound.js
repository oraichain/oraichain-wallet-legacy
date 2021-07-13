import React from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { pagePaths } from "src/consts/pagePaths";
import Button from "src/components/Button";
import styles from "./NotFound.module.scss";

const cx = cn.bind(styles);

const NotFound = ({ isLoggedIn, title }) => {
    const history = useHistory();
    return (
        <div className={cx("not-found")}>
            <div className={cx("title")}>{title}</div>
            <div className={cx("action")}>
                {isLoggedIn ? (
                    <Button variant="primary" size="lg" onClick={
                       () => {
                           history.push(pagePaths.HOME);
                       }
                    }>
                        Goto Home
                    </Button>
                ) : (
                    <Button variant="secondary" size="lg" onClick={
                       () => {
                           history.push(pagePaths.SIGNIN);
                       }
                    }>
                        Goto Sigin
                    </Button>
                )}
            </div>
        </div>
    );
};

NotFound.propTypes = {
    isLoggedIn: PropTypes.bool,
    title: PropTypes.string,
};
NotFound.defaultProps = {
    title: "PAGE NOT FOUND",
};

export default NotFound;
