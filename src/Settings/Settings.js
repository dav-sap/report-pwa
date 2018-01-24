import React, { Component } from 'react';
import './settings.css';
import Login from './Login/Login'
import UserHome from './UserHome/UserHome'
import {urlB64ToUint8Array, applicationServerPublicKey} from './../Utils';
import { SERVER_URL} from './../Consts';
import { notification} from 'antd';

const IdbKeyval = require('idb-keyval');

export default class Settings extends Component {
    state = {
        login: true,
        waitAuth: false,
        nameValue: "",
        emailValue: "",
        location: "",
        loading: false,

    };
    user = {};

    componentDidMount() {
        IdbKeyval.get('user').then(val => {
            this.user = val;
            this.setState({
                login: val === (null || undefined),
            });
        });
    }
    changeFullName = (fn) => {
        this.setState({
            nameValue: fn
        })
    };
    changeLoc = (loc) => {
        this.setState({
            location: loc
        })
    };

    unsubscribeUser = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready
                .then(function(reg) {
                    reg.pushManager.getSubscription()
                        .then(function (subscription) {
                            if (subscription) {
                                subscription.unsubscribe();
                            } else {
                                console.log("User is already unsubscribed")
                            }
                        })
                        .catch(function (error) {
                            console.error('Error unsubscribing', error);
                        })
                })
                .then( () => {
                    console.log('User is unsubscribed.');
                })
                .catch(function (error) {
                    console.log('Error after unsubscribing', error);
                })
        }
        IdbKeyval.set('user', null).then(() => {
            this.user = null;
        });
        IdbKeyval.set('waitAuth', false).then(() => {
            this.setState({
                waitAuth: false,
            });
        });
        this.setState({
            login: true,
        })
    };

    subscribeUser = (name, email, url) => {

        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready
                .then((reg) => {
                    return reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: applicationServerKey
                    }).then((sub) => {
                        return sub;
                    });
                })
                .then((sub) => {
                    let subJson = JSON.stringify(sub);
                    // console.log(subJson);
                    let reqProps = {
                        method: 'POST',
                        headers: new Headers({
                            name: name,
                            email: email,
                            sub: subJson,
                        })
                    };

                    fetch(SERVER_URL + url, reqProps)
                        .then(res => {
                            if (res.status !== 200) {
                                throw {msg: "Error Connecting"};
                            } else {
                                IdbKeyval.set('waitAuth', true).then(() => {
                                    this.setState({waitAuth: true});
                                });
                            }
                        })
                        .catch(err => {
                            throw err
                        })
                }).catch(e => {
                    notification['error']({
                        message: 'Connection Error',
                        description: "No Internet Connection, or server is offline",
                    });
                    this.setState({loading: false});
                    IdbKeyval.set('waitAuth', false).then(() => {
                        this.setState({waitAuth: false});
                    });
                 });
        }
    };

    login = () => {
        this.subscribeUser(this.state.nameValue, this.state.emailValue, "/login");
    };
    signup = () => {
        this.subscribeUser(this.state.nameValue, this.state.emailValue, "/register");
    };


    changeEmail = (email) => {
        if (email.includes("@intel.com")) {
            this.setState({
                emailValue: email
            })
        } else {
            this.setState({
                emailValue: email + "@intel.com"
            }, () => {
                let cursorLoc = (email + "@intel.com").indexOf("@intel.com");
                document.getElementById("email-input").setSelectionRange(cursorLoc,cursorLoc)
            })

        }

    };
    render() {
        return (
            <div className="settings">
                {this.state.login ? <Login nameValue={this.state.nameValue} emailValue={this.state.emailValue}
                                           changeLoc={this.changeLoc} changeEmail={this.changeEmail} changeFullName={this.changeFullName}
                                           login={this.login} signup={this.signup} chosenLoc={this.state.location}/>
                    : <UserHome/>}
            </div>
        );
    }
}

