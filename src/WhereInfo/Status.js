import React, { Component } from 'react';
import {COLOR_MAP, STATUS} from './../Consts'

export default class Status extends Component {
    getStyle = () => {
        let retStyle = {}
        if (this.props.title === STATUS.ARRIVING) {
            retStyle = {display: "grid",
            gridTemplateColumns: "50% 50%",
            justifyContent: "center",
            textAlign: "center"}
        }
        return retStyle;
    }
    render() {
        return (
            <div className="status-where">
                <div className="status-where-title" style={{background: COLOR_MAP[this.props.title]}}>
                    {this.props.title + " - " + this.props.reports.length}
                    {this.props.loading ? <div className="loader"/> : ""}
                    {/* <span className="span-img">{IMAGE_MAP(this.props.title, "status-where-img")}</span> */}
                </div>
                <div className="people-wrapper" style={this.getStyle()}>
                    {this.props.reports.map((report, index) => {
                        let desc = report.statusDescription === STATUS.FREE_STYLE  || this.props.title === STATUS.ARRIVING ? "" : " - " + report.statusDescription
                        let note = desc + (report.note ? " - " + report.note : "");
                        return <p key={index} className="name">{report.name + note} </p>;
                    })}
                </div>
            </div>
        );
    }
}