import React, { Component } from 'react';
import './user-home.css';
import {Icon} from 'antd'
import {Link } from 'react-router-dom';
import {addErrorNoti} from './../../Utils';
import { SERVER_URL} from './../../Consts';
import {applicationServerPublicKey, urlB64ToUint8Array} from "../../Utils";

export default class UserHome extends Component {
    constructor(props) {
        super(props);
        this.removeReport = this.removeReport.bind(this);
    }
    state = {
        notificationStatus: true,
    }
    async removeReport(status, report_id) {
        try {
           
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    name: this.props.user.name,
                    email: this.props.user.email,
                    report_id: report_id
                })
            };
            let response = await fetch(SERVER_URL + "/remove_report", reqProps);
            if (response.status === 500) {
                throw new Error("Can't remove report, internet connection, or server error");
            }
            else if (response.status === 200) {
                this.props.fetchReports(this.props.user);
            }
        }catch (e) {
            addErrorNoti();
        }
    };
    isFullDay(startDate, endDate) {
        return startDate.getHours() === 8 && startDate.getMinutes() === 0 && endDate.getHours() === 17 && endDate.getMinutes() === 0
    }
    getDateStr = (startDateStr, endDateStr, status, index, report_id, recurring) => {
        let locale = "en-us";
        let startDate = new Date(startDateStr)
        let endDate = new Date(endDateStr)
        let timeStr = ('0' + startDate.getUTCHours()).slice(-2) + ":" + ('0' + startDate.getUTCMinutes()).slice(-2) +
        " - " + ('0' + endDate.getUTCHours()).slice(-2) + ":" + ('0' + endDate.getUTCMinutes()).slice(-2)
        let copyStartDate = new Date(startDate.getTime());
        let copyEndDate = new Date(endDate.getTime());
        if (recurring) {
            let weekday = startDate.toLocaleString(locale, { weekday: "long" });
            return (<tr key={index} className="report"><th>{"Every " + weekday}</th>
                    <th>{this.isFullDay(startDate, endDate) ? "All Day" : timeStr}</th>
                    <th>{status}</th>
                    <th><Icon type="close" className="remove-report-button" onClick={() => this.removeReport(status, report_id)}/></th></tr>);
        }
        else if (copyStartDate.setHours(0,0,0,0) === copyEndDate.setHours(0,0,0,0)) {
            let month = startDate.toLocaleString(locale, { month: "short" });
            return (<tr key={index} className="report">
                <th>{month + " " + startDate.getDate()}</th>
                    <th>{timeStr}</th>
                    <th>{status}</th>
                    <th><Icon type="close"  onClick={() => this.removeReport(status, report_id)} className="remove-report-button"/></th></tr>);
        } else {
            let monthStart = startDate.toLocaleString(locale, { month: "short" });
            let monthEnd = endDate.toLocaleString(locale, { month: "short" });
            return (<tr key={index} className="report"><th>{monthStart + " " + startDate.getDate() + " - " + monthEnd + " " + endDate.getDate()}</th>
                    <th></th><th>{status}</th>
                    <th><Icon type="close" className="remove-report-button" onClick={() => this.removeReport(status, report_id)}/></th></tr>);
        }
    };
    async componentDidMount() {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            this.setState({
                notificationStatus: false
            })
        }
        else if (Notification.permission !== "granted") {
            this.setState({
                notificationStatus: false
            })
        } else if (Notification.permission === "granted") {
            try {
                const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                let reg = await navigator.serviceWorker.ready;
                let sub = await reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey});
                let reqProps = {
                    method: 'POST',
                    headers: new Headers({
                        name: this.props.user.name,
                        email: this.props.user.email,
                        sub: JSON.stringify(sub)
                    })
                };

                let response = await fetch(SERVER_URL + "/check_subscription", reqProps);
                if (response.status === 500) {
                    throw new Error("Can't remove notifications, internet connection, or server error");
                }
                else if (response.status === 200) {
                    this.setState({
                        notificationStatus: true
                    })
                }
                else if (response.status !== 200) {
                    this.setState({
                        notificationStatus: false
                    })
                }
                

            }catch (e) {
                addErrorNoti();
            }
        }

    }
    addSubscription = async (sub) => {
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    name: this.props.user.name,
                    email: this.props.user.email,
                    sub: sub
                })
            };

            let response = await fetch(SERVER_URL + "/add_subscription", reqProps);
            if (response.status === 500) {
                throw new Error({msg:"Can't remove notification, internet connection, or server error", status:response.status});
            }
            else if (response.status === 200) {
                this.setState({
                    notificationStatus: true
                })
            }
        }catch (e) {
            addErrorNoti();
            this.setState({
                notificationStatus: false
            })
        }
    };
    removeSubsciption = async (sub) => {
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    name: this.props.user.name,
                    email: this.props.user.email,
                    sub: sub
                })
            };

            let response = await fetch(SERVER_URL + "/remove_subscription", reqProps);
            if (response.status === 500) {
                throw new Error({msg:"Can't remove notification, internet connection, or server error", status:response.status});
            }
            else if (response.status === 200) {
                this.setState({
                    notificationStatus: false
                })
            }
        }catch (e) {
            addErrorNoti();
        }
    };
    changeNotificationStatus =  async () => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            this.setState({
                notificationStatus: false
            })
        }
        else if (Notification.permission !== "granted") {
            let permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("Granted permission for notifications!");
                const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                let reg = await navigator.serviceWorker.ready;
                let sub = await reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey});
                let subJson = JSON.stringify(sub);
                this.addSubscription(subJson);
            } else {
                this.setState({
                    notificationStatus: false
                })
            }
        } else {
            const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
            let reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey});
            let subJson = JSON.stringify(sub);
            if (this.state.notificationStatus) {
                this.removeSubsciption(subJson);
            } else {
                this.addSubscription(subJson);
            }


        }
    };
    onlyUnique(reports) {
        if (reports) {
            let newReports = []
            reports.forEach((report) => {
                if (report.recurring) {
                    let idxOfId = newReports.findIndex(newReport => newReport._id === report._id);
                    if (idxOfId === -1) {
                        newReports.push(report); 
                    }
                
                } else newReports.push(report);
            })
            return newReports;
       
        } else return [];
    }
    getTableWrapperStyle() {
        let h = document.getElementById("top");
        if (h && h.clientHeight) {
            return {height: "calc(100vh - " + (h.clientHeight -3) + "px)", width: "100%"};
        }

    }
    render() {

        return (
            <div className="user-home">
                <Link to="/"><i className="prev-arrow"/></Link>
                <div id="top">
                    <div className="info">
                        <div className="full-name">
                            {this.props.user.name}
                        </div>
                        <div className="email">
                            {this.props.user.email}
                        </div>
                        <div className="location">
                            <img alt="loc" src="/images/loc.png" />
                            {this.props.user.loc}
                        </div>
                    </div>
                    <div className="user-option">
                        {/*<div className="go-to-admin">*/}
                            {/*<div className="admin-wrapper">*/}
                                {/*Admin*/}
                                {/*<img src="/images/admin-settings.png" alt="Go to admin settings" className="admin-settings-img"/>*/}
                            {/*</div>*/}

                        {/*</div>*/}
                        <img alt="notification status" src={this.state.notificationStatus ? "/images/noti-on.png" : "/images/noti-off.png"} className="notification-updater" onClick={this.changeNotificationStatus}/>
                        <div className="logout-button" onClick={this.props.logout}>
                            Logout
                            <Icon type="user-delete" className="logout-img"/>
                        </div>
                    </div>
                </div>
                
                <div className="table-wrapper" style={this.getTableWrapperStyle()}>
                <table className="user-reports">
                    <tbody>
                    {this.onlyUnique(this.props.reports).map((report, index) => {
                        return (
                            this.getDateStr(report.startDate, report.endDate, report.status, index, report._id, report.recurring)
                        )
                    })}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}

