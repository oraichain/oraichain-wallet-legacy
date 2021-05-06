import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./Field.module.scss";
const cx = cn.bind(styles);

const Field = ({ title, input, error }) => {
    return <div className={cx("field")}>
        <div className={cx("field-title")}>
            {title}
        </div>
        <div className={cx("field-input")}>
            {input}
        </div>
        <div className={cx("field-error")}>
            {error}
        </div>
    </div>;
};

Field.propTypes = {
    title: PropTypes.any,
    input: PropTypes.any,
    error: PropTypes.any,
};
Field.defaultProps = {};

export default Field;
