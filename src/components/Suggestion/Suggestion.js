import React, { useState } from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import QuestionIcon from "src/components/icons/QuestionIcon";
import styles from "./Suggestion.module.scss";

const cx = cn.bind(styles);

const Suggestion = ({ text, showModalWhenClick, modalTitle, modalBody }) => {
    const [visible, setVisible] = useState(false);

    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
    };

    return (
        <>
            <div className={cx("suggestion")} onClick={() => {
                if (showModalWhenClick) {
                    show();
                }

            }}>
                <QuestionIcon className={cx("suggestion-icon")} />
                <span className={cx("suggestion-text")}>{text}</span>
            </div>
            <Modal show={visible} onHide={hide}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalBody}</Modal.Body>
            </Modal>
        </>
    );
};

Suggestion.propTypes = {
    text: PropTypes.string,
    showModalWhenClick: PropTypes.bool,
    modalTitle: PropTypes.any,
    modalBody: PropTypes.any,
};
Suggestion.defaultProps = {
    text: "",
    showModalWhenClick: false,
    modalTitle: "",
    modalBody: "",
};

export default Suggestion;
