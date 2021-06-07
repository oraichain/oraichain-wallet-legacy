import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./FormTitle.module.scss";
const cx = cn.bind(styles);

const FormTitle = ({children}) => {
    return <div className={cx('form-title')}>
        {children}
    </div>;
};

FormTitle.propTypes = {
    children: PropTypes.any
};
FormTitle.defaultProps = {};

export default FormTitle;
