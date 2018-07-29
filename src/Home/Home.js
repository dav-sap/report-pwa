import React, { Component } from 'react';
import StatusScreen from './StatusScreen/StatusScreen'
import DateTimePicker from './DateTimePicker/DateTimePicker';
import { COLOR_MAP} from './../Consts';
import {notification, Icon} from 'antd';
import Header from './Header/Header';
import SubmitScreen from './SubmitScreen/SubmitScreen'
import './home.css';
import './point-to-login.css'
import './../loading.css';
import { withRouter } from 'react-router-dom'

import {observer} from "mobx-react/index";
import AppStoreInstance from "./../AppStore";

const IdbKeyval = require('idb-keyval');


class Home extends Component {
    
    async componentDidMount() {
        window['isUpdateAvailable']
            .then(isAvailable => {
                if (isAvailable) {
                    const key = `open${Date.now()}`;

                    notification.config({
                        duration: 30,

                    });
                    notification.open({
                        message: '',
                        description: <p className="notification-text">New Update available!<br/> Reload the App to see the latest juicy changes.</p>,
                        className: "notification-css",
                        icon: <Icon type="reload"  onClick={() => {notification.close(key);window.location.reload()}} style={{color: "white",position: "relative", top: "21px" }}/>,
                        key,
                    });
                }
            });
        let user = await IdbKeyval.get('user');
        AppStoreInstance.updateUser(user);
        // IdbKeyval.get('user').then(val => {
        //     if (val && val.email) {
        //         let reqProps = {
        //             method: 'POST',
        //             headers: new Headers({
        //                 'content-type': 'application/json'
        //             }),
        //             body: JSON.stringify({
        //                 name: val.name,
        //                 email: val.email,
        //             })
        //         };
        //         fetch("/verify_user", reqProps).then( (res) => {
        //                 if (res.status === 401) {
        //                     IdbKeyval.set('user', null);
        //                     AppStoreInstance.updateUser(null);
        //                 }
        //             }
        //         )
        //
        //         AppStoreInstance.updateUser(val);
        //     } else {
        //         IdbKeyval.get('waitingUser').then((val) => {
        //             if (val && val.email) {
        //                 AppStoreInstance.verifyAwaitUser(val);
        //             } else {
        //                 IdbKeyval.set('user', null).then(() =>{
        //                     AppStoreInstance.updateUser(null);
        //                 });
        //             }
        //         })
        //     }
        // });
    }

    render() {
        return (
            <div className="App-wrapper" style={{background: COLOR_MAP[AppStoreInstance.status]}}> 
                <div className="App" style={{width: "100%", maxWidth: "35rem", position: "relative", margin: "auto",maxHeight: "70rem"}}>
                    <Header store={AppStoreInstance} history={this.props.history}/>
                    <div className="app-body">
                        <StatusScreen store={AppStoreInstance} history={this.props.history}/>
                        <DateTimePicker store={AppStoreInstance} history={this.props.history}/>
                        {AppStoreInstance.user ? <SubmitScreen store={AppStoreInstance} history={this.props.history}/> : ""}
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(observer(Home));
