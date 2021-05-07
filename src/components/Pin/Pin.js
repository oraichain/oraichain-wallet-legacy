import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames/bind";
import queryString from "query-string";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "src/assets/icons/arrow-right.svg";
import Cosmos from "@oraichain/cosmosjs";
import Big from 'big.js';

import PinWrap, { openPinWrap } from "src/components/PinWrap";
import { getTxBodySend } from 'src/utils';
import styles from "./Pin.module.scss";


const message = Cosmos.message;
const cx = cn.bind(styles);

const SendTokens = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const user = useSelector(state => state.user);
    

    return <div className={cx("send-token")}>
        <div className={cx("pin-display")}>
          <div className={cx("circle-lock--container")}>
            <div className={cx("circle-lock")}>
              <i className={cx("material-icons lock-icon")}>lock</i>
            </div>
          </div>
          <div className={cx("confirmation-dots")}>
            <svg>
              <g>
                <circle className={cx("pin-circle")} cx="10" cy="10" r="8"></circle>
                <circle className={cx("pin-circle")} cx="50" cy="10" r="8"></circle>
                <circle className={cx("pin-circle")} cx="90" cy="10" r="8"></circle>
                <circle className={cx("pin-circle")} cx="130" cy="10" r="8"></circle>
              </g>
            </svg>
          </div>
          <div className={cx("keypad")}>
            <div className={cx("keypad--row")}>
              <div className={cx("keypad--button")} data-value="1">1</div>
              <div className={cx("keypad--button")} data-value="2">2</div>
              <div className={cx("keypad--button")} data-value="3">3</div>
            </div>
            <div className={cx("keypad--row")}>
              <div className={cx("keypad--button")} data-value="4">4</div>
              <div className={cx("keypad--button")} data-value="5">5</div>
              <div className={cx("keypad--button")} data-value="6">6</div>
            </div>
            <div className={cx("keypad--row")}>
              <div className={cx("keypad--button")} data-value="7">7</div>
              <div className={cx("keypad--button")} data-value="8">8</div>
              <div className={cx("keypad--button")} data-value="9">9</div>
            </div>
            <div className={cx("keypad--row")}>
              <div className={cx("keypad--button keyboard--button__back-arrow")}><i className={cx("material-icons")}>arrow_back</i></div>
              <div className={cx("keypad--button")} data-value="0">0</div>
              <div className={cx("keypad--button keyboard--button__x")}>x</div>
            </div>
          </div>
        </div>
    </div>;
};

SendTokens.propTypes = {};
SendTokens.defaultProps = {};

export default SendTokens;
