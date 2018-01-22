import React, { Component } from 'react';
import './header.css'
import {STATUS} from '../Consts';
import {Icon, Popconfirm, message, Button} from 'antd';
const IdbKeyval = require('idb-keyval');


export default class Header extends Component {
    logout = () => {
        this.props.unsubscribeUser();

    };

    getTitle() {
        let titleStr;
        if (this.props.slideNumber === 0) {
            titleStr = <div>I AM</div>;
        }
        if (this.props.slideNumber === 1) {
            titleStr = <div> I Am {(this.props.status !== STATUS.NO_STATUS ? this.props.status : "")}<br/></div>;
        }
        if (this.props.slideNumber === 2) {
            titleStr = <div> I Am {(this.props.status !== STATUS.NO_STATUS ? this.props.status : "")}<br/>
                {("from " + this.props.dates.from.toLocaleString('en-En', {
                        month: "short",
                        day: "numeric"
                    }) +
                    " to " + this.props.dates.to.toLocaleString('en-En', {month: "short", day: "numeric"}))}
            </div>;
            if (this.props.dates.from.getTime() === this.props.dates.to.getTime()) {
                titleStr = <div> I Am {(this.props.status !== STATUS.NO_STATUS ? this.props.status : "")}<br/>

                    {" on " + this.props.dates.from.toLocaleString('en-En', {month: "short",day: "numeric"})
                    }<br/>

                    { "from " + this.props.time.from.toLocaleString('en-En', {hour: "numeric",minute: "numeric",hour12: false}) +
                        " to " + this.props.time.to.toLocaleString('en-En', {hour: "numeric",minute: "numeric",hour12: false})}
                </div>;
            }
        }
        if (this.props.slideNumber === 3) {
            titleStr = <div>Where is Everyone?</div>;
        }
        return titleStr;
    }
    render() {
        return (
            <div className="header">
                <Popconfirm placement="leftTop" title={"Logout?"} onConfirm={this.logout} okText="Yes" cancelText="No">
                    <Icon className="unsubscribe-button" type="logout" />
                </Popconfirm>

                {this.props.slideNumber !== 0  ? <img className="prev-img" alt="Go back" onClick={() => this.props.prevFunc(this.props.slideNumber -1 )} src={process.env.PUBLIC_URL + "/next-button.png"}/>: ""}
                <div className="title-font-style">{this.getTitle()}</div>
            </div>
        );
    }
}

