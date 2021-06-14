import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import cn from "classnames/bind";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormTitle from "src/components/FormTitle";
import FormField from "src/components/FormField";
import Label from "src/components/Label";
import TextField from "src/components/TextField";
import Button from "src/components/Button";
import styles from "./Connect.module.scss";

const cx = cn.bind(styles);

const EncryptedMnemonic = ({ setStep, step, queryParam, formData }) => {
    const history = useHistory();

    const schema = yup.object().shape({
        account: yup.string().required("The account is required"),
        mnemonics: yup.string().required("The encrypted mnemonics is required"),
    });

    const methods = useForm({
        defaultValues: {
            mnemonics: formData.encryptedMnemonics,
            account: formData.walletName,
            address: formData.address,
        },
        resolver: yupResolver(schema),
    });
    const { handleSubmit } = methods;

    const goToNextStep = () => {
        setStep(step + 1);
    };

    const onSubmit = (data) => {
        history.push({
            search: queryParam,
        });
        localStorage.setItem(formData.walletName + "-password", formData.encryptedMnemonics);
        goToNextStep();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTitle>Import Wallet With Encrypted Mnemonics</FormTitle>

                <TextField name="account" className="d-none" />
                <TextField type="password" name="mnemonics" className="d-none" />

                <FormField>
                    <Label>Your ORAI address</Label>
                    <TextField type="text" name="address" disabled={true} />
                </FormField>

                {/* <Suggestion
                    text="Why do I have to encrypt my mnemonic pharse?"
                    showModalWhenClick={true}
                    modalTitle={
                        <h5>Why do I have to encrypt my mnemonic pharse?</h5>
                    }
                    modalBody={
                        <>
                            <p>Here are the reasons:</p>
                            <ol>
                                <li>
                                    Keystore is an encrypted private key, it is not easy to write down all the code
                                    correctly. Moreover, users often think that the keystore is secure and they transmit
                                    or store it through the network. It will lead to leaking of keystore which will
                                    greatly increase the risk of asset theft.
                                </li>
                                <li>
                                    The security level of the private key is the same as mnemonic phrases. They are both
                                    unencrypted private keys. However, it is inconvenient to copy and save the private
                                    key. Once the transcription is wrong, it is difficult to correct and retrieve it.
                                </li>
                                <li>
                                    Mnemonic phrases manage multi-chain wallets. Using only one Mnemonic phrase you can
                                    manage assets on multiple chains.
                                </li>
                            </ol>
                        </>
                    }
                /> */}

                <div className="d-flex flex-row justify-content-center mb-4">
                    <Button variant="primary" size="lg" type="submit">
                        Next
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

EncryptedMnemonic.propTypes = {};
EncryptedMnemonic.defaultProps = {};

export default EncryptedMnemonic;
