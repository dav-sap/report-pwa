import React, { Component } from 'react';
import {COLOR_MAP, IMAGE_MAP} from './../Consts'

export default class Status extends Component {

    render() {
        return (
            <div className="status-where">
                <div className="status-where-title" style={{background: COLOR_MAP[this.props.title]}}>
                    {this.props.title}
                    <span className="span-img">{IMAGE_MAP(this.props.title, "status-where-img")}</span>
                </div>
                <div className="people-wrapper">
                    {this.props.people.map((member, index) => {
                        let note = member.note ? " - " + member.note : "";
                        let text = member.name + note;
                        return <p key={index} className="name">{text} </p>;
                    })}
                </div>
            </div>
        );
    }
}