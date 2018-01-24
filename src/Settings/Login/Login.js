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
                    <div className="login-body">
                    <fieldset className="field-set-input">
                        <input type="text" placeholder="Full Name" className="text-fullname" value={this.props.nameValue} onChange={this.handleFullNameChange}/>
                    </fieldset>
                    <fieldset className="field-set-input">
                        <input id="email-input" type="text" placeholder="Email @intel.com" className="text-email" value={this.props.emailValue} onChange={this.handleEmailChange}/>
                    </fieldset>
                        <div className="flex-row login-screen-buttons-wrapper">
                            <div className={"login-screen-button button-left " + (this.props.chosenLoc === "JER" ? "clicked-button-style" : "")} onClick={this.props.changeLoc.bind(this, "JER")} >
                                JER
                            </div>
                            <div className={"login-screen-button button-right " + (this.props.chosenLoc === "IDC" ? "clicked-button-style" : "")} onClick={this.props.changeLoc.bind(this, "IDC")} >
                                IDC
                            </div>
                        </div>

                    </div>
                    <div className="flex-row login-screen-buttons-wrapper bottom-buttons">
                        <div className="login-screen-button button-left" onClick={this.props.login} >
                            Login
                        </div>
                        <div className="login-screen-button button-right clicked-button-style" onClick={this.props.signup}>
                            Sign Up
                        </div>
                    </div>
            </div>
        );
    }
}

