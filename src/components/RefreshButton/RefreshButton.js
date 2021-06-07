import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import RefreshIcon from "src/components/icons/RefreshIcon";
import styles from "./RefreshButton.module.scss";

const cx = cn.bind(styles);

const RefreshButton = ({ onClick }) => {
    return (
        <button type="button" className={cx("refresh-button")} onClick={() => {
            onClick && onClick();
        }}>
            <RefreshIcon className={cx("refresh-button-icon")} />
        </button>
    );
};

RefreshButton.propTypes = {
    onClick: PropTypes.func,
};
RefreshButton.defaultProps = {};

export default RefreshButton;
