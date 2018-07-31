import React, { Component } from 'react';
import {STATUS} from './../Consts'

export default class Status extends Component {

    startedScrollCount = 0;
    interval = null;
    getStyle = () => {
        let retStyle = {height: this.props.height + "px"}
        if (this.props.title === STATUS.ARRIVING) {
            retStyle = {display: "grid",
            gridTemplateColumns: "50% 50%",
            justifyContent: "center",
            textAlign: "center",
            height: this.props.height + "px"}
        }
        return retStyle;
    }

    componentDidMount() {
        let el = document.getElementById("people-wrapper-"+this.props.title);
        this.interval =
            setInterval(() => {
            if (el.scrollHeight - el.scrollTop <=  el.clientHeight && this.props.reports.length > 0 && this.startedScrollCount > 30) {
                setTimeout(() => {
                    el.scrollTop = 0
                }, 3000);
                this.startedScrollCount = 0;
            } else {
                this.startedScrollCount++;
                el.scrollTop += 1
            }}, 100)
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render() {
        return (
            <div className="status-where">
                <div className="status-where-title" style={{background: this.props.color}}>
                    {this.props.title + " - " + this.props.reports.length}
                </div>
                <div className="people-wrapper" id={"people-wrapper-"+this.props.title} style={this.getStyle()}>
                    {this.props.reports.map((report, index) => {
                        let desc = report.statusDescription === STATUS.FREE_STYLE
                                    || this.props.title === STATUS.ARRIVING ? "" : " - " + report.statusDescription
                        let note = desc + (report.note ? " - " + report.note : "");
                        return <p key={index} className="report-line">{report.name + note} </p>;
                    })}
                </div>
            </div>
        );
    }
}