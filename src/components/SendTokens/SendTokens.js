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
import styles from "./SendTokens.module.scss";


const message = Cosmos.message;
const cx = cn.bind(styles);

const SendTokens = () => {
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const user = useSelector(state => state.user);
    const queryStringParse = queryString.parse(history.location.search) || {};
    const cosmos = window.cosmos;

    const onChildKey = async (childKey) => {
        try {
            const amount = 0;
            const to = '0';
            const memo = '';
            const txBody = getTxBodySend(user, to, amount, memo);
            const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK') || {};
            if (queryStringParse.signInFromScan) {
                window.opener.postMessage(res.tx_response, "*");
                window.close();
            }
        } catch (ex) {
            alert(ex.message);
            return;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        openPinWrap();
    }

    return <div className={cx("send-token")}>
        <form
            revalidateMode
            className="keystation-form"
            onSubmit={handleSubmit}
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
