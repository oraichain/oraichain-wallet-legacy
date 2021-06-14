import React from 'react';
import ReactDOM from 'react-dom';
import App from 'src/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'src/index.css';
import reportWebVitals from './reportWebVitals';

const $ = (window.jQuery = require('jquery'));

const render = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const domain = searchParams.get('domain');
  switch (domain) {
    case 'oraiscan':
      renderOrainScan();
    default:
      renderDefault();
  }
};

const renderDefault = () => {
  ReactDOM.render(<App />, document.getElementById('app'));

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals(console.log);
};

const renderOrainScan = () => {
  $('#app').hide().html(`<div class="inner">
  <h1><img src="img/keystation_logo_.png" alt="" width="145"></h1>
  <h2>Sign In</h2>

  <form class="keystation-form">
      <span class="input input--fumi">
          <input class="input__field input__field--fumi input-account" type="text">
          <label class="input__label input__label--fumi">
              <i class="fa fa-fw fa-user icon icon--fumi"></i>
              <span class="input__label-content input__label-content--fumi">Wallet Name</span>
          </label>
      </span>
      <input style="display:none;" type="password" autocomplete="current-password" tabindex="-1" spellcheck="false">
      <p id="formInfoMessage" class="information-text">
          <i class="fa fa-fw fa-question-circle"></i> Unavailable in guest mode or incognito mode.
      </p>
      <p id="errorOnSignIn" class="error">
          
          <i class="fa fa-fw fa-exclamation-circle"></i> <span></span>
      </p>

      <button type="button" onclick="sendEventToParent()" id="nextBtn">Next</button>
  </form>

  <a href="import?client=https%3A%2F%2Fapi.wallet.orai.io%2F&amp;lcd=https%3A%2F%2Flcd.orai.io&amp;path=44%2F118%2F0%2F0%2F0&amp;payload=%22orai%22&amp;option=">Import Wallet</a>

  
  <a class="disableChecksum" style="position:fixed;bottom:0;left:0;color:#fff;" href="import?client=https%3A%2F%2Fapi.wallet.orai.io%2F&amp;lcd=https%3A%2F%2Flcd.orai.io&amp;path=44%2F118%2F0%2F0%2F0&amp;payload=%22orai%22&amp;option=disablechecksum">■</a>

  
  <div class="pin-wrap">
      <button type="button">&#10005;</button>
      <div class="pin-cont">
          <h2>Please enter your PIN.</h2>
          <div class="dots-cointainer">
              <div class="dots">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div>+</div>
                  <div class="dot"></div>
              </div>
          </div>

          <div class="wrapper-number no-select">
              <div class="finger grid-number">6</div><div class="finger grid-number">4</div><div class="finger grid-number">9</div><div class="finger grid-number">3</div><div class="finger grid-number">2</div><div class="finger grid-number">7</div><div class="finger grid-number">0</div><div class="finger grid-number">5</div><div class="finger grid-number">8</div><div class="grid-number"></div><div class="finger grid-number">1</div><div class="finger grid-number">←</div>
          </div>

          <div class="wrapper-alphabet no-select">
              <div class="finger grid-number">O</div><div class="finger grid-number">G</div><div class="finger grid-number">W</div><div class="finger grid-number">F</div><div class="finger grid-number">P</div><div class="finger grid-number">S</div><div class="finger grid-number">E</div><div class="finger grid-number">X</div><div class="finger grid-number">K</div><div class="finger grid-number">M</div><div class="finger grid-number">H</div><div class="finger grid-number">N</div><div class="finger grid-number">T</div><div class="finger grid-number">Y</div><div class="finger grid-number">Q</div><div class="finger grid-number">C</div><div class="finger grid-number">R</div><div class="finger grid-number">J</div><div class="finger grid-number">A</div><div class="finger grid-number">Z</div><div class="finger grid-number">U</div><div class="finger grid-number">B</div><div class="finger grid-number">I</div><div class="finger grid-number">V</div><div class="finger grid-number">L</div><div class="finger grid-number">D</div><div class="grid-number"></div><div class="finger grid-number">←</div>
          </div>
      </div>
  </div>
  
</div>`);

  $(() => {
    // remove default mainstyle
    $('head>link')
      .filter((i, e) => {
        return ['bootstrap.min.css', 'styles.css'].includes(
          e.href.split('/').pop()
        );
      })
      .remove();
    $('head').append(`  
<link rel="stylesheet" href="https://api.wallet.orai.io/css/styles.css" />
<script src="https://api.wallet.orai.io/js/bundle.js?t=20200225"></script>
<script src="https://api.wallet.orai.io/js/classie.js"></script>
<script src="https://api.wallet.orai.io/js/classie.js"></script>
<script src="https://api.wallet.orai.io/js/input.js"></script>
<script src="https://api.wallet.orai.io/js/pin.js?t=20210524"></script>
`);
    window.onload = () => $('#app').show();
  });
};

render();
