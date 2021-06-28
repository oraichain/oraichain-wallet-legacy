import React from "react";
import cn from "classnames/bind";
import _ from "lodash";
import { useGet } from "restful-react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import CopyButton from "src/components/CopyButton";
import RefreshButton from "src/components/RefreshButton";
import Button from "src/components/Button";
import styles from "./Wallet.module.scss";
import { lcdApiPaths } from "src/consts/apiPaths";
import { formatFloat } from "src/utils";
const cx = cn.bind(styles);

const Wallet = ({ user, removeUser }) => {
    const { data, loading, error, refetch } = useGet({
        path: `${process.env.REACT_APP_LCD}${lcdApiPaths.BALANCES}/${user.address}`,
    });

    let balanceElement;

    if (loading) {
        balanceElement = <Skeleton width={50} />;
    } else {
        if (error) {
            balanceElement = "-";
        } else {
            balanceElement = (
                <div className={cx("balance")}>
                    <div className={cx("balance-amount")}>
                        {_.isNil(data?.balances?.[0]?.amount) ? "-" : formatFloat(data.balances[0].amount / Math.pow(10, 6), 6)}
                    </div>
                    <div className={cx("balance-denom")}>
                        {_.isNil(data?.balances?.[0]?.denom) ? "-" : data.balances[0].denom}
                    </div>
                </div>
            );
        }
    }

    return (
        <div className={cx("wallet")}>
            <div className={cx("wallet-info")}>
                <div className={cx("wallet-info-title")}>
                    Address <CopyButton text={user.address} />
                </div>
                <div className={cx("wallet-info-value")}>{user.address}</div>
            </div>

            <div className={cx("wallet-info")}>
                <div className={cx("wallet-info-title")}>
                    Balance{" "}
                    <RefreshButton
                        onClick={() => {
                            refetch();
                        }}
                    />
                </div>
                <div className={cx("wallet-info-value")}>{balanceElement}</div>
            </div>

            <div className="d-flex flex-row justify-content-center mt-4">
                <Button
                    variant="outline-primary"
                    fitContent
                    onClick={() => {
                        removeUser();
                    }}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
};

Wallet.propTypes = {
    user: PropTypes.any,
    removeUser: PropTypes.any,
};
Wallet.defaultProps = {};

export default Wallet;
