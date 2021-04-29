import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import TextField from "src/components/TextField";
import styles from "./SignIn.module.scss";
import logoUrl from "src/images/logo.png";

const cx = cn.bind(styles);

const SignIn = () => {
    const methods = useForm();
    const onSubmit = (data) => console.log(data);

    return (
        <div className={cx("sign-in")}>
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-md-6 h-100 d-flex justify-content-center align-items-center">
                        <div className={cx("title")}>
                            <img className={cx("title-logo")} src={logoUrl} alt="" />
                            <span className={cx("title-text")}>Oraiscan</span>
                        </div>
                    </div>
                    <div className="col-md-6 h-100 d-flex justify-content-center align-items-center">
                        <div className={cx("card")}>
                            <div className={cx("card-header")}>Sign In</div>
                            <div className={cx("card-body")}>
                                <FormProvider {...methods} >
                                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                                        <TextField type="text" variant="line" name="walletName" placeholder="Walletname" />

                                    </form>
                                </FormProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

SignIn.propTypes = {
    toggleSearchArea: PropTypes.func,
};
SignIn.defaultProps = {};

export default SignIn;
