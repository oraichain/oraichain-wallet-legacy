import React from "react";
import { useFormContext } from "react-hook-form";
import cn from "classnames/bind";

import styles from "./FormInput.scss";
import { isNil } from "lodash-es";
import _ from "lodash";

const cx = cn.bind(styles);

function FormInput(props) {
    const { getValues, setValue, register, watch } = useFormContext();
    const {
        name,
        placeholder,
        label,
        errorobj,
        classNameCustom,
        wrapperStyle,
        autoComplete,
        type = "text",
        onInput,
        onChange,
        isTextArea,
    } = props;

    let value = watch(name);

    let errorMessage = "";
    if (errorobj && errorobj.hasOwnProperty(name)) {
        errorMessage = errorobj[name].message;
    }

    return (
        <>
            <div className={cx("input-text", wrapperStyle || "")}>
                {_.isNil(isTextArea) ? (
                    <input
                        inputRef={register}
                        className={cx(classNameCustom)}
                        type={type}
                        name={name}
                        defaultValue={""}
                        autoComplete={autoComplete}
                        value={value}
                        onInput={onInput}
                        onChange={(e) => {
                            !_.isNil(onChange)
                                ? onChange(e)
                                : setValue(name, e.currentTarget.value);
                        }}
                    />
                ) : (
                    <textarea
                        inputRef={register}
                        className={cx(classNameCustom)}
                        type={type}
                        name={name}
                        defaultValue={""}
                        autoComplete={autoComplete}
                        value={value}
                        onInput={onInput}
                        onChange={(e) => {
                            !_.isNil(onChange)
                                ? onChange(e)
                                : setValue(name, e.currentTarget.value);
                        }}
                    ></textarea>
                )}
            </div>
            <div className={cx("required-label")}>{errorMessage}</div>
        </>
    );
}

export default FormInput;
