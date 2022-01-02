import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import SocketIOService from "./services/socket";
import StabMeBackPalette from "./services/theme";
import {Provider} from "react-redux";
import {persistor, store} from "./services/redux"
import {PersistGate} from 'redux-persist/integration/react'

if (process.env.NODE_ENV === 'production') {
    console.log("Have fun looking at the code !")
    if (window.location.href.split('?')[1] !== "debug") {
        console.log = () => {
        }
        console.group = () => {
        }
        console.groupEnd = () => {
        }
        console.info = () => {
        }
    }
}

SocketIOService()

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <StabMeBackPalette>
                    <App/>
                </StabMeBackPalette>
            </PersistGate>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

