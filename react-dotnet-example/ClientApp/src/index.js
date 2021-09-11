import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import Order from './components/Pages/Order';
import Home from './Home';
import Login from './Login';


import registerServiceWorker from './registerServiceWorker';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter basename={baseUrl}>
        <Route exact path='/' component={Login} />
        <Route exact path='/App' component={App} />
        <Route path="/order" exact component={Order} />
        <Route path="/home" exact component={Home} />
    </BrowserRouter>,
    rootElement);

registerServiceWorker();