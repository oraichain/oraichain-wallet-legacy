import React from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import _ from "lodash";
import { FormProvider, useForm } from "react-hook-form";
import { pagePaths } from "src/consts/pagePaths";
import Pin from "src/components/Pin";
import AuthLayout from "src/components/AuthLayout";
import FormContainer from "src/components/FormContainer";
import styles from "./Auth.module.scss";
import Button from "../Button";
import TextField from "../TextField";

const cx = cn.bind(styles);

const Auth = ({ user, removeUser }) => {

    const history = useHistory();
    const methods = useForm({
        defaultValues: {
            account: user?.account ?? "",
        }
    });
    const { register, watch } = methods;
    const isLoggedIn = !_.isNil(user);

    const getEncryptedPassword = () => {
        const pw = watch("password");
        if (!!pw) {
            return pw;
        }
        const storageKey = user.account + "-password";
        return localStorage.getItem(storageKey);
    }

    if (!isLoggedIn) {
        history.push(pagePaths.SIGNIN);
        return null;
    }

    return (
        <AuthLayout>
            <FormContainer>
                <FormProvider {...methods}>
                    <form>
                        <TextField type="text" name="account" className="d-none" />
                        <TextField type="password" name="password" autoComplete="current-password" className="d-none" />
                    </form>
                </FormProvider>
                <Pin
                    pinType="confirm"
                    walletName={user.account}
                    encryptedPassword={getEncryptedPassword()}
                    closePin={window.close}
                />
                <div className="d-flex flex-row justify-content-center mt-4 mb-2">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={removeUser}>
                        Logout
                    </Button>
                </div>
            </FormContainer>
        </AuthLayout>
    );
};

Auth.propTypes = {
    user: PropTypes.any,
    removeUser: PropTypes.func,
};
Auth.defaultProps = {};

export default Auth;
