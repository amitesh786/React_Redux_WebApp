import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// Custom create dev
import { store } from './helpers';
import { App } from './App';

// Setup the fake BE
import { configureFakeBackend } from './helpers';
configureFakeBackend();

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
