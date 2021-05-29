import React from 'react';
import ReactDOM from 'react-dom';
import App from 'src/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'src/index.css';
import reportWebVitals from './reportWebVitals';

window.$ = window.jQuery = require('jquery')

ReactDOM.render(
    <App />,
    document.getElementById("app")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
