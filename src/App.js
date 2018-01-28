import React, { Component } from 'react';
import './App.css';
import Home from './Home/Home'
import Settings from './Settings/Settings'
import WhereInfo from './WhereInfo/WhereInfo'
// import { Router, browserHistory, Route } from 'react-router';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';



export default class App extends Component {


  render() {
    return (
        <BrowserRouter>
            <Switch>
                <Route  exact path="/" component={Home}/>
                <Route  exact path="/where-is-everyone" component={WhereInfo}/>
                <Route  exact path="/settings" component={Settings}/>
                <Redirect from='*' to='/' />
            </Switch>
        </BrowserRouter>
    );
  }
}

