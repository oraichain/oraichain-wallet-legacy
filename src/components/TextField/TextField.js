import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { useFormContext } from "react-hook-form";
import styles from "./TextField.module.scss";

const cx = cn.bind(styles);

const TextField = ({ variant, type, name, placeholder, autoComplete, className, id, ...rest }) => {
    const { register } = useFormContext();
    return (
        <input
            className={
                cx("text-field", !_.isNil(variant) && "text-field-" + variant) +
                (!_.isNil(className) ? ` ${className}` : "")
            }
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            autoComplete={autoComplete}
            {...register(name)}
            {...rest}
        />
    );
};

TextField.propTypes = {
    variant: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.string,
    id: PropTypes.string,
};
TextField.defaultProps = {
    type: "text",
    placeholder: "",
    autoComplete: "",
    id: "",
};

export default TextField;
