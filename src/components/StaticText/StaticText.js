import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./StaticText.module.scss";
const cx = cn.bind(styles);

const StaticText = ({ children }) => {
    return <div className={cx("static-text")}>{children}</div>;
};

StaticText.propTypes = {
    children: PropTypes.any,
};
StaticText.defaultProps = {};

export default StaticText;
