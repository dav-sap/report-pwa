import React, { Component } from 'react';
import './header.css'
import {STATUS} from './../../Consts';
import {Icon} from 'antd';
import {Link } from 'react-router';


export default class Header extends Component {

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
                <Link to="/settings"><Icon className="user-settings-button" type="user" /></Link>
                {this.props.slideNumber !== 0  ? <img className="prev-img" alt="Go back" onClick={() => this.props.prevFunc(this.props.slideNumber -1 )} src="/images/next-button.png"/>: ""}
                <div className="title-font-style">{this.getTitle()}</div>
            </div>
        );
    }
}

