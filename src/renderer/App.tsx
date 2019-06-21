import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Button } from 'antd';

import './app.scss';
import testPng from './asset/test.png';

const appElement = document.createElement('div');
document.body.appendChild(appElement);

const Hello = () => (
    <div>
        <h1>hello</h1>
        <img src={testPng} alt="" />
        <Button type="primary">click me</Button>
    </div>
);

const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        appElement
    );
};

render(Hello);
