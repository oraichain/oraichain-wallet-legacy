import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

const $ = window.jQuery;

const render = () => {
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals(console.log);
  const searchParams = new URLSearchParams(window.location.search);
  const domain = searchParams.get('domain') || localStorage.get('domain');
  localStorage.set('domain', domain);
  switch (domain) {
    case 'oraiscan':
      return renderOrainScan();
    default:
      return renderDefault();
  }
};

const renderDefault = () => {
  const App = require('src/App').default;
  require('bootstrap/dist/css/bootstrap.min.css');
  require('src/index.css');
  ReactDOM.render(<App />, document.getElementById('app'));
};

const renderOrainScan = () => {
  window.lcd = process.env.REACT_APP_LCD || 'https://lcd.orai.io';
  $(() => {
    // remove default mainstyle
    const oraiscanWalletBase =
      process.env.REACT_APP_ORAI_SCAN_WALLET || 'https://api.wallet.orai.io';
    const cssList = ['styles.css', 'normalize.custom.css', 'input.css'];
    const jsList = [
      'bundle.js?t=20200225',
      'classie.js',
      'input.js',
      'pin.js?t=20210524'
    ];
    const head = $('head')
      .find('>link')
      .each((i, e) => {
        const name = e.href.split('/').pop().split('?')[0];
        if (cssList.includes(name))
          e.href = `${oraiscanWalletBase}/css/${name}`;
      })
      .end()[0];

    jsList.forEach((src) => {
      const s = document.createElement('script');
      s.setAttribute('src', `${oraiscanWalletBase}/js/${src}`);
      head.appendChild(s);
    });

    // show when css is loaded
    window.onload = () => {
      $('#app>.inner').show();
    };
  });
};

render();
