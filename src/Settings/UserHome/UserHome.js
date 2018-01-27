import React, { Component } from 'react';
import './user-home.css';
import {Icon} from 'antd'
import {Link } from 'react-router';

export default class UserHome extends Component {

    getDateStr = (startDate, endDate, status, index) => {
        let locale = "en-us";
        let copyStartDate = new Date(startDate.getTime());
        let copyEndDate = new Date(endDate.getTime());

        if (copyStartDate.setHours(0,0,0,0) === copyEndDate.setHours(0,0,0,0)) {
            let month = startDate.toLocaleString(locale, { month: "short" });
            return (<tr key={index} className="report"><th>{month + " " + startDate.getDate()}</th>
                    <th>{('0' + startDate.getHours()).slice(-2) + ":" + ('0' + startDate.getMinutes()).slice(-2) +
                    " - " + ('0' + endDate.getHours()).slice(-2) + ":" + ('0' + endDate.getMinutes()).slice(-2)}</th>
                    <th>{status}</th>
                    <th><Icon type="close" className="remove-report-button"/></th></tr>);
        } else {
            let monthStart = startDate.toLocaleString(locale, { month: "short" });
            let monthEnd = endDate.toLocaleString(locale, { month: "short" });
            return (<tr key={index} className="report"><th>{monthStart + " " + startDate.getDate() + " - " + monthEnd + " " + startDate.getDate()}</th>
                    <th></th><th>{status}</th>
                    <th><Icon type="close" className="remove-report-button"/></th></tr>);
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
                        <Icon type="environment" />
                        {this.props.user.loc}
                    </div>
                </div>
                <div className="user-option">
                    <div className="go-to-admin">
                        <div className="admin-wrapper">
                            Admin
                            <img src="/images/admin-settings.png" alt="Go to admin settings" className="admin-settings-img"/>
                        </div>

                    </div>
                    <div className="logout-button" onClick={this.props.logout}>
                        Logout
                        <Icon type="user-delete" className="logout-img"/>
                    </div>
                </div>
                </div>
                <div className="table-wrapper">
                <table className="user-reports">
                    <tbody>
                    {this.props.reports.map((report, index) => {
                        return (
                            this.getDateStr(report.startDate, report.endDate, report.status, index)
                        )
                    })}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}

