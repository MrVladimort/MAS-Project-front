import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {BrowserRouter, Route} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './rootReducer'
import {login} from "./actions/auth";
import setAuthorizationHeader from "./utils/setAuthorizationHeader";

import * as serviceWorker from './serviceWorker';
import authApi from "./api/auth";


const store = createStore(
    rootReducer, composeWithDevTools(applyMiddleware(thunk))
);

async function init() {
    try {
        const token = localStorage.getItem('MAS');
        if (token) {
            setAuthorizationHeader(token);
            const userData = await authApi.authWithToken();
            login(userData, store.dispatch);
        }
    } catch (err) {
        console.log(err);
        localStorage.removeItem("MAS");
        setAuthorizationHeader();
    }

    ReactDOM.render(
        <BrowserRouter>
            <Provider store={store}>
                <Route store={store} component={App}/>
            </Provider>
        </BrowserRouter>,
        document.getElementById('root')
    );
    serviceWorker.unregister();
}

init();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
