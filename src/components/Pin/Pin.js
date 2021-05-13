import {React, useState} from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames/bind";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Cosmos from "@oraichain/cosmosjs";
import { ArrowBack, Close } from '@material-ui/icons';

import PinWrap, { openPinWrap } from "src/components/PinWrap";

import styles from "./Pin.module.scss";

const mockCorrectPin = '0000A';;

const message = Cosmos.message;
const cx = cn.bind(styles);

const Pin = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const user = useSelector(state => state.user);
    let [pinArray, setPinArray] = useState([]);
    let [pinEvaluateStatus, setPinEvaluateStatus] = useState("");

    const handleClick = (e) => {
      switch (e) {
        case 'back':
          pinArray.pop()
          setPinArray([...pinArray])
          setPinEvaluateStatus("")
          break
        case 'reset':
          pinArray = []
          setPinArray([])
          setPinEvaluateStatus("")
          break
        default:
          if (pinArray.length < 5) {
            pinArray.push(e)
            setPinArray([...pinArray])
          }
      }

      if (pinArray.length === 5) {
        evaluatePin(pinArray)
      }
    }

    const evaluatePin = (pinArray) => {
      const enteredPin = pinArray.join("");
      if (enteredPin === mockCorrectPin) {
        
        setTimeout(() => {
          setPinEvaluateStatus("success")
          console.log(true)
          setTimeout(() => {
            // to do
          }, 300);
        }, 250);
        
      } else {

        setTimeout(() => {
          setPinEvaluateStatus("error")
          setTimeout(() => {
            setPinEvaluateStatus("")
            setPinArray([])
          }, 300);
        }, 250);

      }
    }

    const NumPad = () => <div className={cx("keypad", "numpad")}>
      <div className={cx("keypad-row")}>
        <div className={cx("keypad-button")} onClick={() => handleClick(7)}>7</div>
        <div className={cx("keypad-button")} onClick={() => handleClick(8)}>8</div>
        <div className={cx("keypad-button")} onClick={() => handleClick(9)}>9</div>
      </div>
      <div className={cx("keypad-row")}>
        <div className={cx("keypad-button")} onClick={() => handleClick(4)}>4</div>
        <div className={cx("keypad-button")} onClick={() => handleClick(5)}>5</div>
        <div className={cx("keypad-button")} onClick={() => handleClick(6)}>6</div>
      </div>
      <div className={cx("keypad-row")}>
        <div className={cx("keypad-button")} onClick={() => handleClick(1)}>1</div>
        <div className={cx("keypad-button")} onClick={() => handleClick(2)}>2</div>
        <div className={cx("keypad-button")} onClick={() => handleClick(3)}>3</div>
      </div>
      <div className={cx("keypad-row")}>
        <div className={cx("keypad-button")} onClick={() => handleClick('back')}><ArrowBack /></div>
        <div className={cx("keypad-button")} onClick={() => handleClick(0)}>0</div>
        <div className={cx("reset-button")} onClick={() => handleClick('reset')}><Close /></div>
      </div>
    </div>;

    const CharPad = () => {
      const rows = []

      rows.push(<div className={cx("keypad-row")} key="row1">{
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(button => 
          <div className={cx("keypad-button")} key={button} onClick={() => handleClick(button)}>{button}</div>)
        }</div>
      );

      rows.push(<div className={cx("keypad-row")} key="row2">{
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(button => 
          <div className={cx("keypad-button")} key={button} onClick={() => handleClick(button)}>{button}</div>)
        }</div>
      );

      rows.push(<div className={cx("keypad-row")} key="row3">{
        ['back', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'reset'].map(button => {
          switch (button) {
            case 'back':
              return <div className={cx("keypad-button")} key={button} onClick={() => handleClick('back')}><ArrowBack /></div>;
            case 'reset':
              return <div className={cx("reset-button")} key={button} onClick={() => handleClick('reset')}><Close /></div>;
            default:
              return <div className={cx("keypad-button")} key={button} onClick={() => handleClick(button)}>{button}</div>;
          }})
        }</div>
      );
      
      return <div className={cx("keypad", "charpad")}> {rows} </div>;
    };

    return <div className={cx("pin-wrapper")}>
        <div className={cx("pin-display")}>
          <div>
            <div className={cx("pin-title1")}>Enter your PIN</div>
            <div className={cx("pin-title2")}>PIN is required for every transaction.</div>
            <div className={cx("pin-title3")}>If lost, you cannot reset or recover your PIN.</div>
          </div>
          <div className={cx("confirmation-dots")}>
            <svg>
              <g>
                <circle className={cx("pin-circle", pinArray.length > 0 ? "entered" : "", 
                  pinEvaluateStatus)} cx="10" cy="10" r="8"></circle>
                <circle className={cx("pin-circle", pinArray.length > 1 ? "entered" : "", 
                  pinEvaluateStatus)} cx="40" cy="10" r="8"></circle>
                <circle className={cx("pin-circle", pinArray.length > 2 ? "entered" : "", 
                  pinEvaluateStatus)} cx="70" cy="10" r="8"></circle>
                <circle className={cx("pin-circle", pinArray.length > 3 ? "entered" : "", 
                  pinEvaluateStatus)} cx="100" cy="10" r="8"></circle>
                <circle className={cx("pin-circle", pinArray.length > 4 ? "entered" : "", 
                  pinEvaluateStatus)} cx="130" cy="10" r="8"></circle>
              </g>
            </svg>
          </div>

          { pinArray.length < 4 ? <NumPad /> :<CharPad /> }
        
        </div>
    </div>;
};

Pin.propTypes = {};
Pin.defaultProps = {};

export default Pin;
