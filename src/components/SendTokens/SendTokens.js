import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames/bind";
import { ReactComponent as ArrowRightIcon } from "src/assets/icons/arrow-right.svg";
import PropTypes from "prop-types";

import PinWrap, { openPinWrap } from "src/components/PinWrap";
import styles from "./SendTokens.module.scss";
const cx = cn.bind(styles);

const SendTokens = () => {
    const { t, i18n } = useTranslation();

    const onChildKey = () => {

    }

    return <div className={cx("send-token")}>
    <form
        revalidateMode
        className="keystation-form"
      >
        <div className={cx("row", "row-custom")}>
            <div class="col-4 text-right">
                From:
            </div>
            <div class="col-4">
                orai1kwz2df8zqh560kxnujvyta3qzq6pw9yprfcpe9 (50000 orai)
            </div>
        </div>
        <div className={cx("row", "row-custom")}>
            <div class="col-4 text-right">
                To:
            </div>
            <div class="col-4">
                <input type="text" class={cx("form-control", "form-control-custom")} />
            </div>
        </div>
        <div className={cx("row", "row-custom")}>
            <div class="col-4 text-right">
                Amount (orai):
            </div>
            <div class="col-4">
                <input type="text" class={cx("form-control", "form-control-custom")} />
            </div>
        </div>
        <div className={cx("row", "row-custom")}>
            <div class="col-4 text-right">
                Tx Fee (orai):
            </div>
            <div class="col-4">
                <input type="text" class={cx("form-control", "form-control-custom")} />
            </div>
        </div>
        <div className={cx("row", "row-custom")}>
            <div class="col-4 text-right">
                Memo: 
            </div>
            <div class="col-4">
                <textarea class={cx("form-control", "form-control-custom")} rows="3"></textarea>
            </div>
        </div>
        <div className={cx("row", "row-custom", "last-row-custom")}>
            <div class="col-4 text-right">
            </div>
            <div class="col-4">
            <button class="btn btn-primary" type="submit"> Next <ArrowRightIcon /> </button>
            </div>
        </div>
      </form>
        
        <PinWrap show={false} pinType="tx" onChildKey={onChildKey} />
    </div>;
};

SendTokens.propTypes = {};
SendTokens.defaultProps = {};

export default SendTokens;
