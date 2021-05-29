import React from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import { pagePaths } from "src/consts/pagePaths";
import { anotherAppLogin } from "src/utils";
import Pin from "src/components/Pin";
import styles from "./Auth.module.scss";
import LogoutIcon from "../icons/LogoutIcon";

const cx = cn.bind(styles);

const Auth = ({ user, removeUser }) => {
    const history = useHistory();
    const methods = useForm();
    const { register, watch } = methods;
    const isLoggedIn = !_.isNil(user);

    if (!isLoggedIn) {
        history.push(`${pagePaths.SIGNIN}?via=dialog`);
        return null;
    }

    const account = user?.account || "";

    return (
        <>
            <FormProvider {...methods}>
                <form>
                    <input
                        {...register("account")}
                        style={{ display: "none" }}
                        type="text"
                        tabIndex={-1}
                        spellCheck="false"
                        defaultValue={account}
                    />
                    <input
                        {...register("password")}
                        style={{ display: "none" }}
                        type="password"
                        autoComplete="current-password"
                        tabIndex={-1}
                        spellCheck="false"
                    />
                </form>
            </FormProvider>
            <Pin
                pinType="confirm"
                closePin={() => {
                    window.close();
                }}
                anotherAppLogin={anotherAppLogin}
                encryptedMnemonics={watch("password")}
                footerElement={
                    <div className={cx("logout-button")} onClick={() => {
                        removeUser();
                    }}>
                        Logout
                    </div>

                }
                loggedInAccount={user.account}
                loggedInAddress={user.address}
            />
        </>

    );
};

Auth.propTypes = {
    user: PropTypes.any,
    removeUser: PropTypes.func,
};
Auth.defaultProps = {};

export default Auth;
