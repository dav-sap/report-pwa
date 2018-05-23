import React, { Component } from 'react';
import './login.css'
import {Link } from 'react-router-dom';
import {Icon} from 'antd'

export default class Login extends Component {

    handlePasswordChange = (event) => {
        this.props.changePassword(event.target.value);
    };
    handleEmailChange = (event) => {
        this.props.changeEmail(event.target.value);
    };
    changePwdVisibility = () => {
        let x = document.getElementById("pwd-input");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    render() {
        return (
            <div className="login">
                <Link to="/"><i className="prev-arrow"/></Link>
                <div className="login-text">But Wait, <br/> who AM I ?!</div>
                    <div className="login-body">
                   
                    <fieldset className="field-set-input">
                        <input id="email-input" type="text" placeholder="Email @intel.com" className="text-email" value={this.props.emailValue} onChange={this.handleEmailChange}/>
                    </fieldset>
                    <fieldset className="field-set-input">
                        <input type="password" id="pwd-input" placeholder="password" className="text-password" value={this.props.passwordValue} onChange={this.handlePasswordChange}/>
                        <Icon type="eye-o" className="pwd-visibility-icon" onClick={this.changePwdVisibility}/>
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

