import React, { Component } from 'react';
import './login.css'

export default class Login extends Component {

    handleFullNameChange = (event) => {
        this.props.changeFullName(event.target.value);
    };
    handleEmailChange = (event) => {
        this.props.changeEmail(event.target.value);
    };

    render() {
        return (
            <div className="login">
                <div className="login-text">But Wait, <br/> who AM I ?!</div>

                <fieldset className="field-set-input">
                    <input type="text" placeholder="Full Name" className="text-fullname" onChange={this.handleFullNameChange}/>
                </fieldset>
                <fieldset className="field-set-input">
                    <input type="text" placeholder="Email" className="text-email" onChange={this.handleEmailChange}/>
                </fieldset>
            </div>
        );
    }
}

