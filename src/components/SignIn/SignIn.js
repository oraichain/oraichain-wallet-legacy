import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import Field from "src/components/Field";
import TextField from "src/components/TextField";
import ErrorText from "src/components/ErrorText";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import OrDivider from "src/components/OrDivider";
import ButtonGroup from "src/components/ButtonGroup/ButtonGroup";
import styles from "./SignIn.module.scss";

const cx = cn.bind(styles);

const SignIn = () => {
    const methods = useForm();
    const { register, handleSubmit, watch, formState: { errors } } = methods;
    const onSubmit = () => {
        console.log(methods.getValues())
    };

    return (
        <div className={cx("card")}>
            <div className={cx("card-header")}>Sign In</div>
            <div className={cx("card-body")}>
                <FormProvider {...methods} >
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <Field
                            title="Walletname"
                            input={<TextField type="text" variant="light" name="walletName" placeholder="" {...register("walletName")} />}
                        />
                        <Suggestion text="Unavailable in guest mode or incognito mode" />
                        <Button variant="primary" size="lg" onClick={onSubmit}>
                            Next
                        </Button>
                    </form>
                </FormProvider>
                <OrDivider />
                <ButtonGroup className={cx("button-group")}>
                    <Button variant="outline-primary" size="lg" onClick={() => {

                    }}>
                        Import Wallet
                    </Button>
                    <Button variant="outline-success" size="lg" onClick={() => {

                    }}>
                        Import Private Key
                    </Button>
                </ButtonGroup>
            </div>
            <div className={cx("card-footer")}>
                <div className={cx("question")}>
                    <div className={cx("question-text")}>
                        Dont have a wallet?
                    </div>
                    <Link to="/sign_up" className={cx("question-link")}>Create Wallet</Link>
                </div>
            </div>

        </div>
    );
};

SignIn.propTypes = {
};
SignIn.defaultProps = {};

export default SignIn;