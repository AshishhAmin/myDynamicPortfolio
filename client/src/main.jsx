import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('[DEBUG] main.jsx execution started');

window.onerror = function (msg, url, line, col, error) {
    console.log('[FATAL ERROR]', msg, 'at', line, ':', col);
    document.body.innerHTML = `<div style="color:red;padding:20px;background:white"><h1>Fatal Error</h1><p>${msg}</p></div>`;
    return false;
};

window.onunhandledrejection = function (event) {
    console.log('[PROMISE ERROR]', event.reason);
};

console.log('[DEBUG] Root element:', document.getElementById('root'));

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
