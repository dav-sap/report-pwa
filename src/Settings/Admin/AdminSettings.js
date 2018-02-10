import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import {notification} from 'antd';
import {SERVER_URL} from './../../Consts'
import {ServerBadResponseException} from './../../Utils'
import './admin-settings.css';

export default class AdminSettings extends Component {
    state = {
        members: [],
        awaitingMembers: [],
    }
    async fetchMembers(url, stateMembersToChange) {
        try {
            let reqProps = {
                method: 'GET',
            };
            let res = await fetch(SERVER_URL + url, reqProps);

            if (res.status === 200) {
                let json = await res.json();

                this.setState({
                    [stateMembersToChange]: json.members
                });
            } else {
                throw new ServerBadResponseException("Can't get updated user reports", res.status);

            }
        } catch(e) {
            notification['error']({
                message: 'Connection Error',
                description: "Can't get updated users data",
            });
        }
    }
    componentDidMount() {
        this.fetchMembers("/get_all_members", 'members');
        this.fetchMembers("/get_awaiting_members", 'awaitingMembers');
    }
    async removeAwaitUser(member) {
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    name: member.name,
                    email: member.email,
                })
            };
            let res = await fetch(SERVER_URL + "/deny_user", reqProps);
            if (res.status === 200) {
                this.fetchMembers("/get_awaiting_members", 'awaitingMembers');
            } else {
                throw new ServerBadResponseException("Can't get updated user reports", res.status);

            }
        } catch(e) {
            notification['error']({
                message: 'Connection Error',
                description: "Can't remove user",
            });
        }
    };
    async addAwaitUser(member){
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    name: member.name,
                    email: member.email,
                })
            };
            let res = await fetch(SERVER_URL + "/add_user", reqProps);

            if (res.status === 200) {
                this.fetchMembers("/get_all_members", 'members');
                this.fetchMembers("/get_awaiting_members", 'awaitingMembers');
            } else {
                throw new ServerBadResponseException("Can't get updated user reports", res.status);

            }
        } catch(e) {
            notification['error']({
                message: 'Connection Error',
                description: "Can't add user",
            });
        }
    };

    render() {
        return (
            <div className="admin-settings">
                <div className="contents-wrapper">
                <Link to="/"><img className="prev-img" alt="Go back" src="/images/next-button.png"/></Link>
                <div className="admin-title">Admin<img src="/images/admin-settings.png" alt="admin" className="admin-settings-img"/></div>
                {this.state.awaitingMembers.length > 0 ? <div className="sub-admin-title">Awaiting Approval</div> : ""}
                <table className="members-table">
                    <tbody>
                    {this.state.awaitingMembers.map((member, index) => {
                        return (
                            <tr key={index} className="member-row">
                                <th><div className="member-table-cell">{member.name}</div></th>
                                <th><div className="member-table-cell">{member.email}</div></th>
                                <th className="last-cell-row">
                                    <div className="member-table-cell-images">
                                        <img src="/images/v.png" alt="add" className="add-member-button" onClick={this.addAwaitUser.bind(this, member)}/>
                                        <img src="/images/x.png" alt="remove" className="remove-member-button" onClick={this.removeAwaitUser.bind(this, member)}/>
                                    </div>
                                </th>
                            </tr>)
                    })}


                    </tbody>
                </table>
                {this.state.members.length > 0 ? <div className="sub-admin-title">Members</div> : ""}
                <table className="members-table">
                    <tbody>
                    {this.state.members.map((member, index) => {
                        return (
                            <tr key={index} className="member-row">
                                <th><div className="member-table-cell">{member.name}</div></th>
                                <th><div className="member-table-cell">{member.email}</div></th>
                                <th className="last-cell-row"><div className="member-table-cell-remove-button">Remove
                                </div></th>
                            </tr>)
                    })}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}