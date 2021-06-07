import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./Label.module.scss";
const cx = cn.bind(styles);

const Label = ({ htmlFor, children }) => {
    return (
        <label className={cx("label")} htmlFor={htmlFor}>
            {children}
        </label>
    );
};

Label.propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.any,
};
Label.defaultProps = {};

export default Label;
