import React from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./Auth.module.scss";
import { pagePaths } from "src/consts/pagePaths";
import Pin from "../Pin";
const cx = cn.bind(styles);

const Auth = ({ user, removeUser }) => {
    const history = useHistory();
    const methods = useForm();
    const { register, watch } = methods;
    const isLoggedIn = !_.isNil(user);

    if (!isLoggedIn) {
        history.push(pagePaths.SIGNIN);
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
                onConfirmSuccess={(childKey) => {
                    const { privateKey, chainCode, network } = childKey;
                    window.opener.postMessage({ privateKey, chainCode, network }, '*');
                    window.close();
                }}
                encryptedMnemonics={watch("password")}
                footerElement={
                    <div className={cx("logout-button")} onClick={() => {
                        removeUser();
                    }}>
                        Logout
                    </div>
                }
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
