import React, { useEffect } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import styles from "./AlertBox.module.scss";
import CheckIcon from "../icons/CheckIcon";
import TimesIcon from "../icons/TimesIcon";
const cx = cn.bind(styles);

const AlertBox = ({ visible, variant, duration, message, hide, onHide }) => {
    useEffect(() => {
        if (visible) {
            const timeout = setTimeout(() => {
                hide();
                if (!_.isNil(onHide)) {
                    onHide();
                }
            }, duration);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [visible]);

    if (!visible) {
        return null;
    }

    let statusIcon;
    if (variant === "success") {
        statusIcon = <CheckIcon className={cx("status-icon", "status-icon-success")} />;
    } else {
        statusIcon = <TimesIcon className={cx("status-icon", "status-icon-error")} />;
    }

    return (
        <div className={cx("alert-box", "alert-box-" + variant)}>
            <div className={cx("status")}>{statusIcon}</div>
            <div className={cx("message")}>{message}</div>
            <div className={cx("close")} onClick={hide}>
                <TimesIcon className={cx("close-icon")} />
            </div>
        </div>
    );
};

AlertBox.propTypes = {
    visible: PropTypes.bool,
    variant: PropTypes.string,
    duration: PropTypes.number,
    message: PropTypes.string,
    hide: PropTypes.any,
    onHide: PropTypes.any,
};
AlertBox.defaultProps = {};

export default AlertBox;
