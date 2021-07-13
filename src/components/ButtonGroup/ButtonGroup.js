import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./ButtonGroup.module.scss";
const cx = cn.bind(styles);

const ButtonGroup = ({ className, children }) => {
    return (
        <div className={cx("button-group", className && className)}>
            {children}
        </div>
    );
};

ButtonGroup.propTypes = {
    className: PropTypes.string,
    children: PropTypes.any
};
ButtonGroup.defaultProps = {};

export default ButtonGroup;
