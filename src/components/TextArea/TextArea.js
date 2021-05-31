import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { useFormContext } from "react-hook-form";
import styles from "./TextArea.module.scss";

const cx = cn.bind(styles);

const TextArea = ({ name, placeholder, autoComplete, className, disabled }) => {
    const { register } = useFormContext();
    return (
        <textarea
            className={cx("text-area") + (!_.isNil(className) ? ` ${className}` : "")}
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            {...register(name)}
        />
    );
};

TextArea.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.string,
    disabled: PropTypes.bool,
};
TextArea.defaultProps = {
    placeholder: "",
    autoComplete: "",
    disabled: false,
};

export default TextArea;
