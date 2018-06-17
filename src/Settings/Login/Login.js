import React, { Component } from 'react';
import './login.css'
import {Link } from 'react-router-dom';
import {Icon, AutoComplete } from 'antd'
import {addErrorNoti} from "../../Utils";
import {SERVER_URL} from "../../Consts";

export default class Login extends Component {
    state = {
        forgotPwdStr: "Forgot Password?",
        groups: [],
    }
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
    fetchGroups = async () => {
        try {

            let res = await fetch(SERVER_URL + "/get_groups", {method: 'GET'});

            if (res.status === 200) {
                let  resJson = await res.json();
                this.setState({groups:resJson.groups})

            } else {
                throw new Error({msg:"Can't get updated user reports", status:res.status});
            }
        } catch (e) {
            addErrorNoti();
        }
    }

    componentDidMount() {
        this.fetchGroups()
    }


    render() {
        return (
            <div className="login">
                <Link to="/"><i className="prev-arrow"/></Link>
                <div className="login-text">But Wait, <br/> who AM I ?!</div>
                    <div className="login-body">
                   
                        <fieldset className="field-set-input">
                            <input id="email-input" type="text" placeholder="Email" className="text-email" value={this.props.emailValue} onChange={this.handleEmailChange}/>
                        </fieldset>
                        <fieldset className="field-set-input">
                            <input type="password" id="pwd-input" placeholder="password" className="text-password" value={this.props.passwordValue} onChange={this.handlePasswordChange}/>
                            <Icon type="eye-o" className="pwd-visibility-icon" onClick={this.changePwdVisibility}/>
                        </fieldset>
                        <div className="forgot-pwd" onClick={() => this.setState({forgotPwdStr: "Forgot Password?                  Contact Admin!"})}>
                            {this.state.forgotPwdStr}
                        </div>
                        <div className="flex-row group-wrapper">
                            {/*<div className="group-title">*/}
                            {/*Group:*/}
                            {/*</div>*/}
                            <AutoComplete
                                dataSource={this.state.groups.filter(group => group)}
                                placeholder="Group Name"
                                className="group-autocomplete"
                                value={this.props.group}
                                onChange={this.props.changeGroup}
                                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            />
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

