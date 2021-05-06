import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import QuestionIcon from "src/components/icons/QuestionIcon";
import styles from "./Suggestion.module.scss";

const cx = cn.bind(styles);

const Suggestion = ({ text }) => {
    return <div className={cx("suggestion")}>
        <QuestionIcon className={cx("suggestion-icon")} />
        <span className={cx("suggestion-text")}>
            {text}
        </span>
    </div>;
};

Suggestion.propTypes = {
    text: PropTypes.string
};
Suggestion.defaultProps = {
    text: ""
};

export default Suggestion;
