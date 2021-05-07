import {React, useState} from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames/bind";
import queryString from "query-string";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "src/assets/icons/arrow-right.svg";
import Cosmos from "@oraichain/cosmosjs";
import { ArrowBack, Lock } from '@material-ui/icons';
import Big from 'big.js';

import PinWrap, { openPinWrap } from "src/components/PinWrap";
import { getTxBodySend } from 'src/utils';
import styles from "./Pin.module.scss";

const mockCorrectPin = '0000';

const message = Cosmos.message;
const cx = cn.bind(styles);

const Pin = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const user = useSelector(state => state.user);
    let [pinArray, setPinArray] = useState([]);
    let [correctPin, setCorrectPin] = useState(false);

    const handleClick = (e) => {
      switch (e) {
        case 'back':
          pinArray.pop()
          setPinArray([...pinArray])
          break
        case 'reset':
          pinArray = []
          setPinArray([])
          break
        default:
          if (pinArray.length <= 4) {
            pinArray.push(e)
            setPinArray([...pinArray])
          }
      }
      console.log(pinArray)

      if (pinArray.length === 4)
        evaluatePin(pinArray)
    }

    const evaluatePin = (pinArray) => {
      const enteredPin = pinArray.join("");
      if (enteredPin === mockCorrectPin) {
        
        setTimeout(() => {
          openLock("correct PIN")
          setTimeout(() => {
            // setCorrectPin(true)
          }, 500);
        }, 250);
        
      } else {
        setTimeout(() => {
          openLock("wrong PIN")
          setTimeout(() => {
            // setCorrectPin(false)
          }, 300);
        }, 250);
      }
    }
    
    const openLock = (result) => {
      alert(result)
    }

    return <div className={cx("pin-wrapper")}>
        <div className={cx("pin-display")}>
          <div className={cx("circle-lock--container")}>
            <div className={cx("circle-lock")}>
              <Lock />
            </div>
          </div>
          <div className={cx("confirmation-dots")}>
            <svg>
              <g>
                <circle className={cx("pin-circle", pinArray.length > 0 ? "entered" : "")} cx="10" cy="10" r="8"></circle>
                <circle className={cx("pin-circle", pinArray.length > 1 ? "entered" : "")} cx="40" cy="10" r="8"></circle>
                <circle className={cx("pin-circle", pinArray.length > 2 ? "entered" : "")} cx="70" cy="10" r="8"></circle>
                <circle className={cx("pin-circle", pinArray.length > 3 ? "entered" : "")} cx="100" cy="10" r="8"></circle>+
                <circle className={cx("pin-circle")} cx="130" cy="10" r="8"></circle>
              </g>
            </svg>
          </div>
          <div className={cx("keypad")}>
            <div className={cx("keypad--row")}>
              <div className={cx("keypad--button")} onClick={() => handleClick(1)} disable="{disableClick}" >1</div>
              <div className={cx("keypad--button")} onClick={() => handleClick(2)}>2</div>
              <div className={cx("keypad--button")} onClick={() => handleClick(3)}>3</div>
            </div>
            <div className={cx("keypad--row")}>
              <div className={cx("keypad--button")} onClick={() => handleClick(4)}>4</div>
              <div className={cx("keypad--button")} onClick={() => handleClick(5)}>5</div>
              <div className={cx("keypad--button")} onClick={() => handleClick(6)}>6</div>
            </div>
            <div className={cx("keypad--row")}>
              <div className={cx("keypad--button")} onClick={() => handleClick(7)}>7</div>
              <div className={cx("keypad--button")} onClick={() => handleClick(8)}>8</div>
              <div className={cx("keypad--button")} onClick={() => handleClick(9)}>9</div>
            </div>
            <div className={cx("keypad--row")}>
              <div className={cx("keypad--button")} onClick={() => handleClick('back')}><ArrowBack /></div>
              <div className={cx("keypad--button")} onClick={() => handleClick(0)}>0</div>
              <div className={cx("keypad--button")} onClick={() => handleClick('reset')}>x</div>
            </div>
          </div>
        </div>
    </div>;
};

Pin.propTypes = {};
Pin.defaultProps = {};

export default Pin;
