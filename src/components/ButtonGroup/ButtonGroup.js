import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./ButtonGroup.module.scss";
const cx = cn.bind(styles);

const ButtonGroup = ({ children }) => {
    return (
        <div className={cx("button-group")}>
            {children}
        </div>
    );
};

ButtonGroup.propTypes = {
    children: PropTypes.any
};
ButtonGroup.defaultProps = {};

export default ButtonGroup;
