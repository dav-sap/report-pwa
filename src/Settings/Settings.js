import React, { Component } from 'react';
import './settings.css';
import Login from './Login/Login'
import UserHome from './UserHome/UserHome'
import WaitAuthScreen from './WaitAuthScreen/WaitAuthScreen'
import LoadingCircle from './../LoadingCircle'
import {urlB64ToUint8Array, applicationServerPublicKey} from './../Utils';
import { SERVER_URL} from './../Consts';
import {addErrorNoti, addNotification} from './../Utils';
import {notification} from 'antd';
import AppStoreInstance from "./../AppStore";
import {observer} from "mobx-react/index";
import { withRouter } from 'react-router-dom'

const IdbKeyval = require('idb-keyval');

class Settings extends Component {
    constructor(props) {
        super(props);
        this.subscribeUser = this.subscribeUser.bind(this);
        this.unsubscribeUser = this.unsubscribeUser.bind(this);
        this.cancelRequest = this.cancelRequest.bind(this);
    }
    state = {
        passwordValue: "",
        emailValue: "",
        location: "",
        loading: false,
        reports: null,
    };


    parseReports = (reports) => {
        this.setState({
            reports: reports.sort((a, b) => {
                return a.startDate > b.startDate ? -1 : a.startDate < b.startDate ? 1 : 0;
            })
        })
    };
    async fetchReports(val) {
        try {
            let reqProps = {
                method: 'GET',
                headers: new Headers({
                    email: val.email,
                })
            };
            let res = await fetch(SERVER_URL + "/get_user_reports", reqProps);

            if (res.status === 200) {
                res.json().then(json => {
                    this.parseReports(json);
                })
            } else {
                throw new Error({msg:"Can't get updated user reports", status:res.status});
            }
        } catch (e) {
            addErrorNoti();
        } 
    }
    
    async componentDidMount() {
        // this.startUpData();
        this.setState({loading:true})
        let val = await IdbKeyval.get('user');
        if (val && val.email) {
            AppStoreInstance.updateUser(val);
            await this.fetchReports(val);
            this.setState({loading:false, mounted: true})
        } else {
            val = await IdbKeyval.get('waitingUser');
            if (val && val.email) {
                await AppStoreInstance.verifyAwaitUser(val);
                this.setState({loading:false, mounted: true})
            } else {
                await IdbKeyval.set('user', null);
                AppStoreInstance.updateUser(null);
                this.setState({loading:false, mounted: true})
            }
        }
        
    }
    startLoading = () => {
        this.setState({loading:true})
    }
    stopLoading = () => {
        this.setState({loading:false})
    }

    changePassword = (fn) => {
        this.setState({
            passwordValue: fn
        })
    };

    changeLoc = (loc) => {
        this.setState({
            location: loc
        })
    };

    async unsubscribeUser(){
        IdbKeyval.set('user', null).then(() => {
            AppStoreInstance.updateUser(null);
        });
        IdbKeyval.set('waitAuth', false).then(() => {
            AppStoreInstance.updateWaitAuth(false);
        });
        try {
            let sub = null;
            if ('serviceWorker' in navigator) {
                let reg = await navigator.serviceWorker.ready;
                sub = await reg.pushManager.getSubscription();
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
                    email: AppStoreInstance.user.email,
                    sub: sub ? JSON.stringify(sub) : {},
                })
            };

            let response = await fetch(SERVER_URL + "/logout", reqProps);
            if (response.status === 500) {
                throw new Error({msg:"Can't unsubscribe in server", status:response.status});
            }

        } catch(e) {
            console.error("Error while unsubscribing");
        }
    };

    async subscribeUser (pwd, email, url, location){
        this.setState({loading: true});
        try {
            let subJson = {};
            if ('serviceWorker' in navigator) {

                if (!("Notification" in window)) {
                    console.log("This browser does not support desktop notification");
                }
                else if (Notification.permission === "granted") {
                    console.log("This site already granted Notifications!");
                    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                    let reg = await navigator.serviceWorker.ready;
                    let sub = await reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey});
                    subJson = sub;
                }
                else if (Notification.permission === "default") {
                    let permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        console.log("Granted permission for notifications!");
                        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                        let reg = await navigator.serviceWorker.ready;
                        let sub = await reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey});
                        subJson = sub;
                    }
                }else if (Notification.permission === "denied" && url === "/register") {
                    addNotification("Norifications are blocked! Go to chrome settings to allow");
                } else {
                    console.log("notification permission status unknown", Notification.permission);
                }

            }
            else {
                console.error("No Service worker!");
            }

            console.log(subJson);
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    password: pwd,
                    email: email,
                    sub: JSON.stringify(subJson),
                    loc: location ? location : AppStoreInstance.user.loc
                })
            };

            let response = await fetch(SERVER_URL + url, reqProps);

            if (response.status === 500) {
                throw new Error({msg:"Can't " + url.substr(1) + " user", status: response.status});
            } else if (response.status === 202) {
                IdbKeyval.set('waitAuth', true).then(() => {
                    AppStoreInstance.updateWaitAuth(true)
                });
                IdbKeyval.set('waitingUser', {email:email}).then(() => {
                    AppStoreInstance.updateWaitingUser({email:email});
                });
                addNotification("An admin will review your details")
                
            } else if (response.status === 200){
                let json = await response.json();
                console.log("STATEUS 200", json)
                IdbKeyval.set('user', json.member).then(() => {
                    AppStoreInstance.updateUser(json.member)
                });
                IdbKeyval.set('waitingUser', {}).then(() => {
                    AppStoreInstance.updateWaitingUser({});
                });
                IdbKeyval.set('waitAuth', false).then(() => {
                    AppStoreInstance.updateWaitAuth(false)
                });
                this.fetchReports(json.member);
            }  else if (response.status === 401){
                addNotification("Login Failed! Check email & password");
            } else {
                let text = await response.text();
                throw new Error({msg:text, status:response.status});
            }
            this.setState({loading: false});
        } catch (e) {
            // let description = e.name === "ServerBadResponseException" ? e.status + ": " + e.message : "Unknown Error: " + e;
            addErrorNoti();
            this.setState({loading: false});
            IdbKeyval.set('waitAuth', false).then(() => {
                AppStoreInstance.updateWaitAuth(false);
            });
        }
    };

    login = () => {
        this.subscribeUser(this.state.passwordValue, this.state.emailValue, "/login", this.state.location);
    };
    signup = () => {
        this.subscribeUser(this.state.passwordValue, this.state.emailValue, "/register", this.state.location);
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
                    email: AppStoreInstance.waitingUser.email,
                })
            };

            let response = await fetch(SERVER_URL + "/cancel_await_member", reqProps);

            if (response.status === 500) {
                throw new Error({msg:"Can't cancel member request", status:response.status});
            } else if (response.status === 200 || response.status === 404) {
                IdbKeyval.set('waitAuth', false).then(() => {
                    AppStoreInstance.updateWaitAuth(false);
                    AppStoreInstance.updateUser(null);
                    this.setState({loading: false});
                });
                IdbKeyval.set('waitingUser', {});
            }
        }catch (e) {
            // let description = e.name === "ServerBadResponseException" ? e.status + ": " + e.message : "Unknown Error: " + e;
            addErrorNoti();
            this.setState({loading: false});
        }
    }
    render() {
        return (
            <div className="settings">
                {this.state.loading ? <LoadingCircle/>: ""}

                <div style={{opacity: this.state.loading? 0.3 : 1}}>
                    {AppStoreInstance.user === null && !AppStoreInstance.waitAuth && this.state.mounted ?
                    <Login passwordValue={this.state.passwordValue} emailValue={this.state.emailValue}
                           changeLoc={this.changeLoc} changeEmail={this.changeEmail} changePassword={this.changePassword}
                           login={this.login} signup={this.signup} chosenLoc={this.state.location}/> : ""}
                    
                    {AppStoreInstance.waitAuth ? <WaitAuthScreen store={AppStoreInstance}  cancelRequest={this.cancelRequest}/>: ""}
                    {AppStoreInstance.user !== null ? <UserHome  startLoading={this.startLoading} stopLoading={this.stopLoading} store={AppStoreInstance} subscribeUser={this.subscribeUser} reports={this.state.reports} logout={this.unsubscribeUser} fetchReports={this.fetchReports.bind(this)}  />: ""}
                </div>
                
            </div>
        );
    }
}

export default withRouter(observer(Settings));


