import React, { Component } from 'react';
import {COLOR_MAP} from './../Consts'

export default class Status extends Component {

    render() {
        return (
            <div className="status-where">
                <div className="status-where-title" style={{background: COLOR_MAP[this.props.title]}}>
                    {this.props.title + " - " + this.props.reports.length}
                    {this.props.loading ? <div className="loader"/> : ""}
                    {/* <span className="span-img">{IMAGE_MAP(this.props.title, "status-where-img")}</span> */}
                </div>
                <div className="people-wrapper">
                    {this.props.reports.map((report, index) => {
                        console.log(report);
                        let note = " - " + report.statusDescription + (report.note ? " - " + report.note : "");
                        let text = report.name + note;
                        return <p key={index} className="name">{text} </p>;
                    })}
                </div>
            </div>
        );
    }
}