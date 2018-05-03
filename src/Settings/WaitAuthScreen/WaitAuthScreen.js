import React, { Component } from 'react';
import {Link } from 'react-router-dom';

import './wait-auth.css';

export default class WaitAuthScreen extends Component {

    render() {
        return (
            <div className="wait-auth">
                <Link to="/"><i className="prev-arrow"/></Link>
                <div className="info">
                    <div className="full-name">
                        {this.props.user ? this.props.user.name : ""}
                    </div>
                    <div className="email">
                        {this.props.user ? this.props.user.email: ""}
                    </div>
                </div>
                <div className="wait-text">
                    Waiting for  approval<span>.</span><span>.</span><span>.</span>
                </div>
                <div className="wait-img-wrapper">
                <img src="/images/waitAuth.png" alt="waiting approval" className="wait-auth-img"/>
                </div>
                <div className="cancel-button" onClick={this.props.cancelRequest} >
                    Cancel Request
                </div>
            </div>
        );
    }
}