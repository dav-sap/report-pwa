import React, { Component } from 'react';
import './App.css';
import Home from './Home/Home'
import Settings from './Settings/Settings'
import WhereInfo from './WhereInfo/WhereInfo'
import { Router, browserHistory, Route } from 'react-router';



export default class App extends Component {


  render() {
    return (
        <Router history={browserHistory}>
            <Route path="/" component={Home}/>
            <Route path="/where-is-everyone" component={WhereInfo}/>
            <Route path="/settings" component={Settings}/>
        </Router>
    );
  }
}

