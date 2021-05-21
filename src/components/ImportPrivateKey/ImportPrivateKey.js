import { React, useState } from "react";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./ImportPrivateKey.module.scss";
import AuthLayout from "../AuthLayout";
import ErrorText from "../ErrorText";
import Field from "../Field";
import { Link } from "react-router-dom";

const cx = cn.bind(styles);

const ImportPrivateKey = ({ history }) => {
    const methods = useForm();

    const { register, handleSubmit, formState: { errors } } = methods;

    const onSubmit = () => {
    };

    const MainLayout = () =>
        <AuthLayout><div className={cx("card")}>
            <div className={cx("card-header")}>Import Private Key</div>
            <div className={cx("card-body")}>
                <FormProvider {...methods} >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Field
                            title="Walletname"
                            input={<input type="text" className={cx("text-field")} name="walletName" placeholder="" {...register("walletName", { required: true })} />}
                        />
                        
                        <Field
                            title="Private Key"
                            input={<input type="password" className={cx("text-field")} name="privateKey" autoComplete="new-password" placeholder="" {...register("privateKey", { required: true })} />}
                        />

                        {(errors.privateKey || errors.walletName) && <ErrorText>Invalid account.</ErrorText>}
                        
                        <Suggestion text="Enter private key. Private key is encrypted and stored in Keychain." />
                        
                        <div className={cx("button-space")}>
                            <Button variant="primary" size="lg" submit={true}>
                                Next
                            </Button>
                        </div>

                        <Link to={`/signin${history.location.search}`}>
                            <Button variant="outline-primary" size="lg">
                                Sign In
                            </Button>
                        </Link>
                    </form>
                </FormProvider>
            </div>
        </div></AuthLayout>

    return (
        <div>
            <MainLayout />
        </div>
    );
};

ImportPrivateKey.propTypes = {
};
ImportPrivateKey.defaultProps = {};

export default ImportPrivateKey;