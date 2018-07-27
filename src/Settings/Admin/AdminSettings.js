import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import {addErrorNoti} from './../../Utils';
import AppStoreInstance from "./../../AppStore";
import './admin-settings.css';
import MembersTable from "./MembersTable";
import WorkFromList from "./WorkFromList";
const IdbKeyval = require('idb-keyval');

export default class AdminSettings extends Component {
    state = {
        members: [],
        awaitingMembers: [],
        user: undefined,
    }
    async fetchMembers(url, stateMembersToChange) {
        try {
            let reqProps = {
                method: 'GET',
            };
            let res = await fetch(url + "?email=" + this.state.user.email, reqProps);

            if (res.status === 200) {
                let json = await res.json();

                this.setState({
                    [stateMembersToChange]: json.members
                }, () => {
                    if (stateMembersToChange === "members") {
                        let copyMembers = this.state.members;
                        this.state.members.forEach( member => {

                            let reqProps = {
                                method: 'GET',
                            };
                            fetch("/get_admin_status?email=" + member.email, reqProps)
                                .then((response) => {
                                    if (response.status === 200) {
                                        response.json()
                                            .then((resJson) => {
                                                copyMembers.map((newMember) => {
                                                    if (member.email.toLowerCase() === newMember.email.toLowerCase()) {
                                                        newMember.adminStatus = resJson.admin;
                                                        return newMember;
                                                    } else return newMember;

                                                })
                                                this.setState({members: JSON.parse(JSON.stringify(copyMembers))})
                                            });
                                    }
                                    else throw new Error("Can't fetch admin status");
                                })
                                .catch(() => {
                                    addErrorNoti();
                                })
                        })
                    }
                });
            } else {
                throw new Error("Error fetching members as admin. Server error");
            }
        } catch(e) {
            console.log(e);
            addErrorNoti();
        }
    }
    async componentDidMount() {
        let user = await IdbKeyval.get('user');
        if (user && user.email) {
            AppStoreInstance.updateUser(user);
            await this.setState({user: user});
            this.fetchMembers("/get_all_members", 'members');
            this.fetchMembers("/get_awaiting_members", 'awaitingMembers');
        }
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
            let res = await fetch("/deny_user", reqProps);
            if (res.status === 200) {
                this.fetchMembers("/get_awaiting_members", 'awaitingMembers');
            } else {
                throw new Error({msg:"Can't get updated user reports", status:res.status});

            }
        } catch(e) {
            addErrorNoti();
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
            let res = await fetch("/add_user", reqProps);

            if (res.status === 200) {
                this.fetchMembers("/get_all_members", 'members');
                this.fetchMembers("/get_awaiting_members", 'awaitingMembers');
            } else {
                addErrorNoti();

            }
        } catch(e) {
            addErrorNoti();
        }
    };

    render() {
        return (
            <div className="admin-settings">
                <div className="contents-wrapper">
                    <Link to="/"><i className="prev-arrow"/></Link>
                    <div className="admin-title">Admin Settings - Welcome {this.state.user ? this.state.user.name : ""}</div>
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
                    <MembersTable members={this.state.members} store={AppStoreInstance} fetchMembers={this.fetchMembers}/>
                    {this.state.user ? <WorkFromList store={AppStoreInstance}/> : "" }
                </div>
            </div>
        );
    }
}