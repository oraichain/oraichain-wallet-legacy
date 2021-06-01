import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import loadingImage from "src/images/loading.png";
import styles from "./Loading.module.scss";

const cx = cn.bind(styles);

const Loading = ({ message }) => {
    return (
        <div className={cx("loading")}>
            <img className={cx("loading-image")} src={loadingImage} />
            <div className="loading-text">{message}</div>
        </div>
    );
};

Loading.propTypes = {
    message: PropTypes.string,
};
Loading.defaultProps = {
    message: "Loading...",
};

export default Loading;
