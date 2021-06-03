import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { gasValues } from "src/consts/gasValues";
import styles from "./SliderInput.module.scss";

const cx = cn.bind(styles);

const SliderInput = ({ name, id, min, max }) => {
    const { register, watch, setValue } = useFormContext();

    const value = watch(name);
    return (
        <div className={cx("slider-input")}>
            <input type="hidden" {...register(name)} />
            <input
                type="number"
                id={id}
                className={cx("text-field")}
                value={value}
                onChange={(e) => {
                    setValue(name, e.target.value);
                }}
                onBlur={(e) => {
                   if (isNaN(e.target.value) || e.target.value < min || e.target.value > max) {
                        setValue(name, Math.round(( + max) / 2));
                    }
                }}
            />
            <div className={cx("slider")}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    className={cx("slider-range")}
                    value={value}
                    onChange={(e) => {
                        setValue(name, e.target.value);
                    }}
                />
                <div className={cx("slider-text", "slider-text-min")}>{min}</div>
                <div className={cx("slider-text", "slider-text-max")}>{max}</div>
                <div className={cx("slider-text", "slider-text-value")}>{watch(name)}</div>
            </div>
        </div>
    );
};

SliderInput.propTypes = {};
SliderInput.defaultProps = {
    min: gasValues.MIN,
    max: gasValues.MAX,
};

export default SliderInput;
