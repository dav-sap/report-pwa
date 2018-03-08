import React, { Component } from 'react';
import './settings.css';
import Login from './Login/Login'
import UserHome from './UserHome/UserHome'
import WaitAuthScreen from './WaitAuthScreen/WaitAuthScreen'
import {urlB64ToUint8Array, applicationServerPublicKey, ServerBadResponseException} from './../Utils';
import { SERVER_URL} from './../Consts';
import {Icon, notification} from 'antd';

const IdbKeyval = require('idb-keyval');



export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.subscribeUser = this.subscribeUser.bind(this);
        this.startUpData = this.startUpData.bind(this);
        this.unsubscribeUser = this.unsubscribeUser.bind(this);
        this.cancelRequest = this.cancelRequest.bind(this);
    }
    state = {
        login: null,
        waitAuth: false,
        nameValue: "",
        emailValue: "",
        location: "",
        loading: false,
        reports: null,
        user: {},
        waitingUser: {},
    };


    parseReports = (splitJson) => {
        let reports = [];
        splitJson.OOO.forEach(report => {
            reports.push({startDate: new Date(report.startDate), endDate: new Date(report.endDate), status: 'OOO', _id: report._id})
        });
        splitJson.SICK.forEach(report => {
            reports.push({startDate: new Date(report.startDate), endDate: new Date(report.endDate), status: 'SICK', _id: report._id})
        });
        splitJson.WF.forEach(report => {
            reports.push({startDate: new Date(report.startDate), endDate: new Date(report.endDate), status: 'WF', _id: report._id})
        });
        this.setState({
            reports: reports.sort((a, b) => {
                return a.startDate > b.startDate ? -1 : a.startDate < b.startDate ? 1 : 0;
            })
        }, () => {IdbKeyval.set('userReports',this.state.reports)})
    };
    async fetchReports(val) {
        let reqProps = {
            method: 'GET',
            headers: new Headers({
                name: val.name,
                email: val.email,
            })
        };
        let res = await fetch(SERVER_URL + "/get_user_reports", reqProps);

        if (res.status === 200) {
            res.json().then(json => {
                this.parseReports(json);
            })
        } else {
            throw new ServerBadResponseException("Can't get updated user reports", res.status);

        }
    }
    async startUpData() {

        let val = await IdbKeyval.get('user');
        let reports = await IdbKeyval.get('userReports');
        await this.setState({reports: reports, user: val});
        if (val && val.name && val.email && val.subscription !== undefined) {
            try {
                this.setState({waitAuth: false, login: false});
                this.fetchReports(val);
            } catch(e) {
                notification['error']({
                    message: 'Connection Error',
                    description: "Can't get updated user reports",
                });
            }
        } else {
            let waitAuth = await IdbKeyval.get('waitAuth');
            if (waitAuth) {
                this.setState({waitAuth: true, login: false});
                IdbKeyval.get('waitingUser').then((val) => {
                    this.setState({
                        waitingUser: val,
                    })
                })

            }else this.setState({waitAuth: false, login: true})
        }
    }
    componentDidMount() {
        this.startUpData();
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

    async unsubscribeUser(){
        IdbKeyval.set('user', null).then(() => {
            this.setState({
                user: null,
            });
        });
        IdbKeyval.set('waitAuth', false).then(() => {
            this.setState({
                waitAuth: false,
            });
        });
        this.setState({
            login: true,
        });

        try {
            if ('serviceWorker' in navigator) {
                let reg = await navigator.serviceWorker.ready;
                let sub = await reg.pushManager.getSubscription();
                if (sub) {
                    await sub.unsubscribe();
                    console.log('User is unsubscribed.');
                } else {
                    console.log("User is already unsubscribed")
                }
            } else console.error("No Service worker!");
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    name: this.state.user.name,
                    email: this.state.user.email,
                })
            };

            let response = await fetch(SERVER_URL + "/logout", reqProps);
            if (response.status === 500) {
                throw new ServerBadResponseException("Can't unsubscribe in server", response.status);
            }

        } catch(e) {
            console.error("Error while unsubscribing");
        }
    };

    async subscribeUser (name, email, url, location){
        this.setState({loading: true});
        try {
            let subJson = {};
            if ('serviceWorker' in navigator) {
                if (!("Notification" in window)) {
                    console.log("This browser does not support desktop notification");
                }
                else if (Notification.permission === "granted") {
                    console.log("This site already granted Notifications!");
                }
                else if (Notification.permission !== 'denied' || Notification.permission === "default") {
                    let permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        console.log("Granted permission for notifications!");
                        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                        let reg = await navigator.serviceWorker.ready;
                        let sub = await reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey});
                        subJson = sub;
                    }
                }
            }
            else {
                console.error("No Service worker!");
            }

            console.log(subJson);
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    name: name,
                    email: email,
                    sub: JSON.stringify(subJson),
                    loc: location
                })
            };

            let response = await fetch(SERVER_URL + url, reqProps);

            if (response.status === 500) {
                throw new ServerBadResponseException("No Internet Connection, or Server error", response.status);
            } else if (response.status === 202) {
                IdbKeyval.set('waitAuth', true).then(() => {
                    this.setState({waitAuth: true, login: false});
                });
                IdbKeyval.set('waitingUser', {name:name, email:email}).then(() => {
                    this.setState({waitingUser: {name:name, email:email}});
                });
                notification['info']({
                    message: 'Awaiting Approval',
                    description: "An admin will review your details",
                });
            } else if (response.status === 200){
                // let text = await response.text();
                let json = await response.json();

                notification['success']({
                    message: 'Approved',
                    description: json.info,
                });
                IdbKeyval.set('user', json.member).then(() => {
                    this.setState({login: false, user:json.member});
                });
                this.fetchReports(json.member);
            } else {
                let text = await response.text();
                throw new ServerBadResponseException(text, response.status);
            }
            this.setState({loading: false});
        } catch (e) {
            let description = e.name === "ServerBadResponseException" ? e.status + ": " + e.message : "Unknown Error: " + e;
            notification['error']({
                message: 'Connection Error',
                description: description,
            });
            this.setState({loading: false});
            IdbKeyval.set('waitAuth', false).then(() => {
                this.setState({waitAuth: false});
            });
        }
    };

    login = () => {
        this.subscribeUser(this.state.nameValue, this.state.emailValue, "/login", this.state.location);
    };
    signup = () => {
        this.subscribeUser(this.state.nameValue, this.state.emailValue, "/register", this.state.location);
    };


    changeEmail = (email) => {
        if (email.length === 1) {
            this.setState({
                emailValue: email + "@intel.com"
            }, () => {
                let cursorLoc = (email + "@intel.com").indexOf("@intel.com");
                document.getElementById("email-input").setSelectionRange(cursorLoc,cursorLoc)
            })

        } else {
            this.setState({
                emailValue: email
            })
        }
    };

    async cancelRequest() {
        await this.setState({loading: true});
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    name: this.state.waitingUser.name,
                    email: this.state.waitingUser.email,
                })
            };

            let response = await fetch(SERVER_URL + "/cancel_await_member", reqProps);

            if (response.status === 500) {
                throw new ServerBadResponseException("No Internet Connection, or Server error", response.status);
            } else if (response.status === 200 || response.status === 404) {
                IdbKeyval.set('waitAuth', false).then(() => {
                    this.setState({waitAuth: false, login: true, loading: false});
                });
                IdbKeyval.set('waitingUser', {});
                notification['success']({
                    message: 'Request Canceled',
                    description: "You may register with a new account",
                });
            }
        }catch (e) {
            let description = e.name === "ServerBadResponseException" ? e.status + ": " + e.message : "Unknown Error: " + e;
            notification['error']({
                message: 'Connection Error',
                description: description,
            });
            this.setState({loading: false});
        }
    }
    render() {
        return (
            <div className="settings" style={{opacity: this.state.loading ? 0.7 : 1}}>

                {this.state.loading ? <Icon className="loading-icon" type="loading" spin={true}/>: ""}
                {this.state.login === null ? "" : this.state.login ?
                    <Login nameValue={this.state.nameValue} emailValue={this.state.emailValue}
                           changeLoc={this.changeLoc} changeEmail={this.changeEmail} changeFullName={this.changeFullName}
                           login={this.login} signup={this.signup} chosenLoc={this.state.location}/>
                    : this.state.waitAuth ? <WaitAuthScreen user={this.state.waitingUser} cancelRequest={this.cancelRequest}/>
                        : <UserHome user={this.state.user} reports={this.state.reports} logout={this.unsubscribeUser} fetchReports={this.fetchReports.bind(this)} />
                }
            </div>
        );
    }
}

