import { React, useState } from "react";
import cn from "classnames/bind";
import { FormProvider } from "react-hook-form";
import Suggestion from "src/components/Suggestion";
import Button from "src/components/Button";
import styles from "./CreateWallet.module.scss";
import AuthLayout from "../AuthLayout";
import copyIcon from "src/assets/icons/copy.svg";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

const cx = cn.bind(styles);

const CreateWallet = ({ history }) => {
    const cosmos = window.cosmos;

    const [copied, setCopied] = useState(false);
    const [mnemonics, setMnemonics] = useState('');
    const [showMnemonics, setShowMnemonics] = useState(false);

    const changeShowMnemonics = () => {
        setShowMnemonics(!showMnemonics);
    };

    const generateMnemonics = () => {
        setMnemonics(cosmos.generateMnemonic(256));
    };

    const copyToClipboard = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    };

    return (
        <AuthLayout>
            <div className={cx("card")}>
                <div className={cx("card-header")}>Create Wallet</div>
                <div className={cx("card-body")}>
                    <FormProvider>
                        <form onSubmit={() => { }}>
                            <div className={cx("field")}>
                                <div className={cx("field-title")}>Mnemonics</div>
                                <div className={cx("field-input")}>
                                    <div className={cx("mnemonics")}>
                                        <input className={cx("text-field")} type={showMnemonics ? "text" : "password"} value={mnemonics} autoComplete="off" name="mnemonics" placeholder="" onChange={() => { }} />

                                        {copied && <div className={cx("copy-message")}>Encrypted mnemonic phrase is copied.</div>}
                                        <CopyToClipboard onCopy={copyToClipboard} text={mnemonics}>
                                            <div className={cx("copy")}>
                                                <span className={cx("copy-line")}></span>
                                                <img className={cx("copy-image")} src={copyIcon} alt="" />
                                                <span className={cx("copy-btn")}>Copy</span>
                                            </div>
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            </div>

                            <div className={cx("show-mnemonics")}>
                                <input type="radio" checked={showMnemonics} className={cx("show-mnemonics-radio")} id="show-mnemonics" name="" onClick={changeShowMnemonics} onChange={() => { }} />
                                <span className={cx("show-mnemonics-text")}>Show the mnemonics</span>
                            </div>

                            <Suggestion text="Copy this mnemonic then go to import page." />

                            <div className={cx("button-space")}>
                                <Button variant="primary" size="lg" onClick={generateMnemonics}>
                                    Next
                                </Button>
                            </div>

                            <Link to={`/import-wallet${history.location.search}`}>
                                <Button variant="outline-primary" size="lg">
                                    Import Wallet
                                </Button>
                            </Link>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </AuthLayout>
    );
};

CreateWallet.propTypes = {
};
CreateWallet.defaultProps = {};

export default CreateWallet;