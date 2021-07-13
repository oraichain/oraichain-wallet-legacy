import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./OrDivider.module.scss";
const cx = cn.bind(styles);

const OrDivider = ({text}) => {
    return (
        <div className={cx("or-divider")}>
            <div className={cx("or-divider-line")}></div>
            <div className={cx("or-divider-text")}>{text}</div>
        </div>
    );
};

OrDivider.propTypes = {
    text: PropTypes.string
};
OrDivider.defaultProps = {
    text: "Or",
};

export default OrDivider;
