import React, { Component } from 'react';
import {Link } from 'react-router';

import './wait-auth.css';

export default class WaitAuthScreen extends Component {

    render() {
        return (
            <div className="wait-auth">
                <Link to="/"><img className="prev-img" alt="Go back" src="/images/next-button.png"/></Link>
                <div className="info">
                    <div className="full-name">
                        {this.props.user ? this.props.user.name : ""}
                    </div>
                    <div className="email">
                        {this.props.user ? this.props.user.email: ""}
                    </div>
                </div>
                <div className="wait-text">
                    <p>Waiting for <br/> approval</p>
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