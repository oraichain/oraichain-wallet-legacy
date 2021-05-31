import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { Spinner } from "react-bootstrap";
import styles from "./Loading.module.scss";

const cx = cn.bind(styles);

const Loading = ({message}) => {
    return (
        <div className={cx("loading")}>
            <Spinner animation="border" role="status" className={cx("loading-icon")}></Spinner>
            <div className={cx("loading-text")}>{message}</div>
        </div>
    );
};

Loading.propTypes = {
    message: PropTypes.string
};
Loading.defaultProps = {
    message: "Loading..."
};

export default Loading;
