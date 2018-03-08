import React, { Component } from 'react';
import './user-home.css';
import {Icon, notification} from 'antd'
import {Link } from 'react-router-dom';
import { SERVER_URL} from './../../Consts';
import {ServerBadResponseException} from './../../Utils';
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
                    name: this.props.user.name,
                    email: this.props.user.email,
                    status: status,
                    report_id: JSON.stringify(report_id)
                })
            };

            let response = await fetch(SERVER_URL + "/remove_report", reqProps);
            if (response.status === 500) {
                throw new ServerBadResponseException("Can't remove report, internet connection, or server error", response.status);
            }
            else if (response.status === 200) {
                this.props.fetchReports(this.props.user);
            }
        }catch (e) {
            let description = e.name === "ServerBadResponseException" ? e.status + ": " + e.message : "Unknown Error: " + e;
            notification['error']({
                message: 'Connection Error',
                description: description,
            });
        }
    };

    getDateStr = (startDate, endDate, status, index, report_id) => {
        let locale = "en-us";
        let copyStartDate = new Date(startDate.getTime());
        let copyEndDate = new Date(endDate.getTime());

        if (copyStartDate.setHours(0,0,0,0) === copyEndDate.setHours(0,0,0,0)) {
            let month = startDate.toLocaleString(locale, { month: "short" });
            return (<tr key={index} className="report"><th>{month + " " + startDate.getDate()}</th>
                    <th>{('0' + startDate.getHours()).slice(-2) + ":" + ('0' + startDate.getMinutes()).slice(-2) +
                    " - " + ('0' + endDate.getHours()).slice(-2) + ":" + ('0' + endDate.getMinutes()).slice(-2)}</th>
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
    componentDidMount() {
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
        } else {
            try {
                let reqProps = {
                    method: 'POST',
                    headers: new Headers({
                        name: this.props.user.name,
                        email: this.props.user.email,
                    })
                };

                fetch(SERVER_URL + "/check_subscription", reqProps).then((response) => {
                    if (response.status === 500) {
                        throw new ServerBadResponseException("Can't remove notification, internet connection, or server error", response.status);
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
                })

            }catch (e) {
                let description = e.name === "ServerBadResponseException" ? e.status + ": " + e.message : "Unknown Error: " + e;
                notification['error']({
                    message: 'Connection Error',
                    description: description,
                });
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
                throw new ServerBadResponseException("Can't remove notification, internet connection, or server error", response.status);
            }
            else if (response.status === 200) {
                this.setState({
                    notificationStatus: true
                })
            }
        }catch (e) {
            let description = e.name === "ServerBadResponseException" ? e.status + ": " + e.message : "Unknown Error: " + e;
            notification['error']({
                message: 'Connection Error',
                description: description,
            });
            this.setState({
                notificationStatus: false
            })
        }
    };
    removeSubsciption = async () => {
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    name: this.props.user.name,
                    email: this.props.user.email,
                })
            };

            let response = await fetch(SERVER_URL + "/remove_subscription", reqProps);
            if (response.status === 500) {
                throw new ServerBadResponseException("Can't remove notification, internet connection, or server error", response.status);
            }
            else if (response.status === 200) {
                this.setState({
                    notificationStatus: false
                })
            }
        }catch (e) {
            let description = e.name === "ServerBadResponseException" ? e.status + ": " + e.message : "Unknown Error: " + e;
            notification['error']({
                message: 'Connection Error',
                description: description,
            });
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
            if (this.state.notificationStatus) {
                this.removeSubsciption();
            } else {
                const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                let reg = await navigator.serviceWorker.ready;
                let sub = await reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey});
                let subJson = JSON.stringify(sub);
                this.addSubscription(subJson);
            }


        }
    };
    render() {
        return (
            <div className="user-home">
                <Link to="/"><img className="prev-img" alt="Go back" src="/images/next-button.png"/></Link>
                <div className="fixed-wrapper">
                <div className="info">
                    <div className="full-name">
                        {this.props.user.name}
                    </div>
                    <div className="email">
                        {this.props.user.email}
                    </div>
                    <div className="location">
                        <img src="/images/loc.png" />
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
                    <img src={this.state.notificationStatus ? "/images/noti-on.png" : "/images/noti-off.png"} className="notification-updater" onClick={this.changeNotificationStatus}/>
                    <div className="logout-button" onClick={this.props.logout}>
                        Logout
                        <Icon type="user-delete" className="logout-img"/>
                    </div>
                </div>
                </div>
                <div className="table-wrapper">
                <table className="user-reports">
                    <tbody>
                    {this.props.reports ? this.props.reports.map((report, index) => {
                        return (
                            this.getDateStr(report.startDate, report.endDate, report.status, index, report._id)
                        )
                    }) : ""}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}

