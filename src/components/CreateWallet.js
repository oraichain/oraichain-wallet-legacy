import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CreateWallet = () => {
  const cosmos = window.cosmos;
  const { t, i18n } = useTranslation();
  const $ = window.jQuery;
  let mnemonic;
  const createWallet = () => {
    // default as backend
    mnemonic = cosmos.generateMnemonic(256);
    $('#mnemonics').text('*'.repeat(mnemonic.length));
    $('#mnemonics-input').val(mnemonic);
  };

  const toggleMnemonic = () => {
    $('#mnemonics').css('opacity', 0);
    setTimeout(() => {
      if ($('#mnemonics').text().match(/\*+/)) {
        $('#mnemonics').text(mnemonic);
      } else {
        $('#mnemonics').text('*'.repeat(mnemonic.length));
      }
      $('#mnemonics').css('opacity', 1);
    }, 500);
  };

  const copyAddress = () => {
    const copyText = document.getElementById('mnemonics-input');
    copyText.select();
    document.execCommand('copy');
    $('.notification-modal').text('Mnemonic is copied.');
    $('.notification-modal').show();
    setTimeout(function () {
      $('.notification-modal').hide();
    }, 2000);
  };

  useEffect(() => {
    createWallet();
  });

  return (
    <div>
      <h2>{t('importWallet')}</h2>

      <form id="import-form1" className="keystation-form" noValidate>
        <p id="formInfoMessage" className="information-text">
          <i className="fa fa-fw fa-question-circle" /> Copy this mnemonic then
          go to import page.
        </p>

        <div className="pw-nnemonics view">
          <div>
            <div id="mnemonics" readOnly disabled></div>
            <button onClick={copyAddress}>
              <i className="fa fa-files-o" />
              <input
                type="text"
                style={{ width: 1, height: 1 }}
                id="mnemonics-input"
              />
              Copy
            </button>
            <i className="fa fa-eye" onClick={toggleMnemonic}></i>
          </div>
        </div>

        <button className="button" type="button" onClick={createWallet}>
          Next
        </button>
      </form>
      <div className="notification-modal"></div>

      <Link to={`/${i18n.language}/import`}>{t('importWallet')}</Link>
    </div>
  );
};

export default CreateWallet;
