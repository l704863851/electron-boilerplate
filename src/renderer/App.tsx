import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

const appElement = document.createElement('div');
document.body.appendChild(appElement);

const Hello = () => <h1>hello</h1>;

const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        appElement
    );
};

render(Hello);
