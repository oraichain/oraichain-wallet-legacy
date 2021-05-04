import bech32 from 'bech32';
import * as bip32 from 'bip32';
import Message from '@oraichain/cosmosjs';
import Big from 'big.js';

const { message } = Message;

export const countWords = (str) => {
  return str.trim().split(/\s+/).length;
};

export const cleanMnemonics = (mnemonics) => {
  mnemonics = mnemonics.split(',').join(' ');
  mnemonics = mnemonics.replace(/ +/g, ' '); // Replace connected spaces with one space
  return mnemonics;
};

export const isMnemonicsValid = (mnemonics, disablechecksum = false) => {
  let validFlag = true;
  // To check the checksum, it is a process to check whether there is an error in creating an address, so you can input any path and prefix.
  try {
    if (disablechecksum) {
      window.cosmos.getAddress(mnemonics, false);
    } else {
      window.cosmos.getAddress(cleanMnemonics(mnemonics));
    }
  } catch (e) {
    validFlag = false;
  }
  return validFlag;
};

export const getFileSize = (size) => {
  const fileSize = size.toString();
  if (fileSize.length < 4) return `${fileSize} bytes`;
  if (fileSize.length < 7)
    return `${Math.round(+fileSize / 1024).toFixed(2)} kb`;
  return `${(Math.round(+fileSize / 1024) / 1000).toFixed(2)} MB`;
};

const selectColor = '#394B59';
export const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'rgb(255 255 255 / 16%)' : selectColor,
    color: '#eee'
  }),
  control: (provided, state) => ({
    ...provided,
    borderWidth: 0,
    boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
    backgroundColor: selectColor
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: '#eee'
  }),
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: selectColor,
    border: '1px solid rgb(144 202 249 / 50%)'
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return {
      ...provided,
      opacity,
      transition,
      color: '#eee'
    };
  }
};

export const getPassword = () => {
  return (
    window.jQuery('input[type=password]').val() ||
    localStorage.getItem('password') || ''
  );
};

export const getChildkeyFromDecrypted = (decrypted) => {
  // it is mnemonics
  if (decrypted.length > 60 + window.cosmos.bech32MainPrefix.length) {
    return window.cosmos.getChildKey(decrypted);
  }
  const { prefix, words } = bech32.decode(decrypted);
  const buffer = Buffer.from(bech32.fromWords(words));
  const childKey = bip32.fromPrivateKey(buffer, Buffer.from(new Array(32)));
  return childKey;
};

export const getTxBodySend = (user, to_address, amount, memo) => {
  const cosmos = window.cosmos;
  const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
      from_address: user.address,
      to_address,
      amount: [{ denom: cosmos.bech32MainPrefix, amount }] // 10
  });

  const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.bank.v1beta1.MsgSend',
      value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny],
      memo
  });
};

export const getTxBodyMultiSend = (user, msgs, memo) => {
  const cosmos = window.cosmos;
  let senderAmount = new Big(0);

  const outputs = msgs.map((msg) => {
      const { amount } = msg.value.amount[0];
      senderAmount = senderAmount.plus(amount);
      return {
          address: msg.value.to_address,
          coins: [{ denom: cosmos.bech32MainPrefix, amount: amount.toString() }],
      };
  });

  const msgSend = new message.cosmos.bank.v1beta1.MsgMultiSend({
      inputs: [{
          address: user.address,
          coins: [{ denom: cosmos.bech32MainPrefix, amount: senderAmount.toString() }]
      }],
      outputs,
  });

  const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.bank.v1beta1.MsgMultiSend',
      value: message.cosmos.bank.v1beta1.MsgMultiSend.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny],
      memo
  });
};

export const getTxBodyDelegate = (user, validator_address, amount, memo) => {
  const cosmos = window.cosmos;
  const msgSend = new message.cosmos.staking.v1beta1.MsgDelegate({
      delegator_address: user.address,
      validator_address,
      amount: { denom: cosmos.bech32MainPrefix, amount } // 10
  });

  const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.staking.v1beta1.MsgDelegate',
      value: message.cosmos.staking.v1beta1.MsgDelegate.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny],
      memo
  });
};

export const getTxBodyUndelegate = (user, validator_address, amount, memo) => {
  const cosmos = window.cosmos;
  const msgSend = new message.cosmos.staking.v1beta1.MsgUndelegate({
      delegator_address: user.address,
      validator_address,
      amount: { denom: cosmos.bech32MainPrefix, amount } // 10
  });

  const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.staking.v1beta1.MsgUndelegate',
      value: message.cosmos.staking.v1beta1.MsgUndelegate.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny],
      memo
  });
};

export const getTxBodyMsgWithdrawDelegatorReward = (user, validator_address) => {
  const msgSend = new message.cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward({
      delegator_address: user.address,
      validator_address,
  });

  const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: message.cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny],
      memo: '',
  });
};

export const getTxCreateValidator = (msg) => {
  const msgSend = new message.cosmos.staking.v1beta1.MsgCreateValidator({
      ...msg,
      pubkey: {
          type_url: '/cosmos.crypto.ed25519.PubKey',
          value: msg.pubkey,
      }
  });

  // const msgSend = new message.cosmos.staking.v1beta1.MsgCreateValidator({
  //     "description": {
  //         "moniker": "test",
  //         "identity": "",
  //         "website": "",
  //         "security_contact": "",
  //         "details": ""
  //     },
  //     "commission": {
  //         "rate": "10",
  //         "max_rate": "30",
  //         "max_change_rate": "25"
  //     },
  //     "min_self_delegation": "1",
  //     "delegator_address": "orai12yxu6j9lp42y9qeyq4dxyu03f8887aa2d4l6hd ",
  //     "validator_address": "oraivaloper12yxu6j9lp42y9qeyq4dxyu03f8887aa2ylynu2",
  //     "pubkey": {
  //         "type_url": "/cosmos.crypto.ed25519.PubKey",
  //         "key": "siQWScAVIK3sxGjk7LKrFXNtKnwMN95i6kmnzL/4m74="
  //     },
  //     "value": {
  //         "denom": "orai",
  //         "amount": "1"
  //     }
  // });

  const msgSendAny = new message.google.protobuf.Any({
      type_url: '/cosmos.staking.v1beta1.MsgCreateValidator',
      value: message.cosmos.staking.v1beta1.MsgCreateValidator.encode(msgSend).finish()
  });

  return new message.cosmos.tx.v1beta1.TxBody({
      messages: [msgSendAny],
      memo: '',
  });
};