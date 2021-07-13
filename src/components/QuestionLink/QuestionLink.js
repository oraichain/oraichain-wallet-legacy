import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./QuestionLink.module.scss";
const cx = cn.bind(styles);

const QuestionLink = ({ questionText, linkTo, linkText }) => {
    return (
        <div className={cx("question")}>
            <div className={cx("question-text")}>{questionText}</div>
            <Link to={linkTo} className={cx("question-link")}>
                {linkText}
            </Link>
        </div>
    );
};

QuestionLink.propTypes = {
    questionText: PropTypes.any,
    linkTo: PropTypes.string,
    linkText: PropTypes.string,

};
QuestionLink.defaultProps = {};

export default QuestionLink;
