import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import Cosmos from '@oraichain/cosmosjs';
import PinWrap, { openPinWrap } from './PinWrap';
const message = Cosmos.message;
const contractDefault = "orai1g2qdlrysa5vg87ywrvswjy3st943a42gcu224w";

const Swap = ({ user }) => {
  const $ = window.jQuery;
  const { t, i18n } = useTranslation();
  const [blocking, setBlocking] = useState(false);
  const [txBody, setTxBody] = useState(new message.cosmos.tx.v1beta1.TxBody({
    messages: []
  }));
  const [balance, setBalance] = useState(0);
  const cosmos = window.cosmos;

  const onWithdraw = () => {
    // will allow return childKey from Pin
    const amount = $('#amount').val().trim();
    const contract = $('#contract').val().trim();
    const msgSend = getWithdrawMessage(contract, amount);
    setTxBody(getTxBody(msgSend));
    openPinWrap();
  }

  const onSwap = () => {
    // will allow return childKey from Pin
    const amount = $('#amount').val().trim();
    const contract = $('#contract').val().trim();
    const msgSend = getSwapMessage(contract, amount);
    setTxBody(getTxBody(msgSend));
    openPinWrap();
  }

  const getWithdrawMessage = (contract, amount) => {
    const msg = Buffer.from(JSON.stringify({ withdraw: { amount: amount } }));
    const msgSend = new message.cosmwasm.wasm.v1beta1.MsgExecuteContract({
      contract,
      msg,
      sender: user.address === "" ? null : user.address,
    });
    return msgSend
  };

  const getSwapMessage = (contract, amount) => {
    const msg = Buffer.from(JSON.stringify({ swap: {} }));
    const sent_funds = amount ? [{ denom: cosmos.bech32MainPrefix, amount }] : null;
    const msgSend = new message.cosmwasm.wasm.v1beta1.MsgExecuteContract({
      contract,
      msg,
      sender: user.address === "" ? null : user.address,
      sent_funds,
    });
    return msgSend
  };

  const getTxBody = (msgSend) => {
    const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmwasm.wasm.v1beta1.MsgExecuteContract',
      value: message.cosmwasm.wasm.v1beta1.MsgExecuteContract.encode(msgSend).finish()
    });

    return new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny]
    });
  }

  const onChildKey = async (childKey) => {
    try {
      setBlocking(true);
      const res = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK');
      $('#tx-json').text(res.tx_response.raw_log);
      updateBalance();
    } catch (ex) {
      alert(ex.message);
    } finally {
      setBlocking(false);
    }
  };

  const updateBalance = async () => {
    try {
      const data = await fetch(`${cosmos.url}/cosmos/bank/v1beta1/balances/${user.address}`).then((res) => res.json());
      const balance = data.balances[0];
      const contract = $('#contract').val().trim();
      $('#balance').html(`(${balance.amount} ${balance.denom})`);
      const tokenBalance = { balance: { address: user.address } };
      try {
        const input = Buffer.from(
          JSON.stringify(tokenBalance)
        ).toString('base64');
        setBlocking(true);
        const data = await fetch(
          `${cosmos.url}/wasm/v1beta1/contract/${contract}/smart/${input}`
        ).then((res) => res.text());
        setBalance(JSON.parse(data).data.balance);
      } catch (ex) {
        alert(ex.message);
      } finally {
        setBlocking(false);
      }

    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    updateBalance();
  }, []);

  return (
    <BlockUi tag="div" blocking={blocking}>
      <h2>Swap native ORAI token with smart contract ORAI token</h2>
      <form className="keystation-form">
        <input style={{ display: 'none' }} type="text" tabIndex={-1} spellCheck="false" name="account" defaultValue={user.name} />
        <input style={{ display: 'none' }} type="password" autoComplete="current-password" tabIndex={-1} spellCheck="false" />
        <div className="keystation-tx-info" id="tx-info">
          <h3 className="send">SEND</h3>
          <span>{t('from')}</span>
          <p>
            {user.address}{' '}
            <strong>
              <small id="balance"></small>
            </strong>
          </p>
          <p>
            {'Current balance of your address in contract: '}{balance}{' ORAI'}
            <strong>
              <small id="balance"></small>
            </strong>
          </p>
          <div className="field">
            <span>{t('amount')} (orai)</span>
            <input id="amount" />
          </div>
          <div className="field">
            <span>{t('contract address')}</span>
            <input id="contract" defaultValue={contractDefault} />
          </div>
        </div>
        <div className="tx-btn-wrap btn-center">
          <button type="button" onClick={onSwap} id="allowBtn">
            Swap
          </button>
          <button type="button" onClick={onWithdraw} id="allowBtn">
            Withdraw
          </button>
        </div>
      </form>

      <div className="keystation-tx-json" id="tx-json"></div>

      <PinWrap show={false} pinType="tx" onChildKey={onChildKey} />
    </BlockUi>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Swap);
