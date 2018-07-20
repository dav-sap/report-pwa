import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import {SERVER_URL} from './../../Consts'
import {addErrorNoti} from './../../Utils';
import AppStoreInstance from "./../../AppStore";
import './admin-settings.css';
import {addNotification} from "../../Utils";
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
            let res = await fetch(SERVER_URL + url + "?email=" + this.state.user.email, reqProps);

            if (res.status === 200) {
                let json = await res.json();

                this.setState({
                    [stateMembersToChange]: json.members
                }, () => {
                    if (stateMembersToChange === "members") {
                        let copyMembers = this.state.members;
                        // let promises = [];
                        this.state.members.forEach( member => {

                            let reqProps = {
                                method: 'GET',
                            };
                            //promises.push(
                            fetch(SERVER_URL + "/get_admin_status?email=" + member.email, reqProps)
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
                                                this.setState({members: copyMembers})
                                            });
                                    }
                                    else throw new Error("Can't fetch admin status");
                                })
                                .catch(() => {
                                    addErrorNoti();
                                })
                            //)
                        })
                        // Promise.all(promises).then(() =>{
                        //     this.setState({members: copyMembers})
                        // });
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
            let res = await fetch(SERVER_URL + "/deny_user", reqProps);
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
            let res = await fetch(SERVER_URL + "/add_user", reqProps);

            if (res.status === 200) {
                this.fetchMembers("/get_all_members", 'members');
                this.fetchMembers("/get_awaiting_members", 'awaitingMembers');
            } else {
                throw new Error({msg:"Can't add user",status: res.status});

            }
        } catch(e) {
            addErrorNoti();
        }
    };
    async removeExistingUser(member){
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    email: member.email,
                    adminEmail: this.state.user.email
                })
            };
            let res = await fetch(SERVER_URL + "/remove_member", reqProps);

            if (res.status === 200) {
                this.fetchMembers("/get_all_members", 'members');
            } else {
                throw new Error({msg:"Can't remove exsiting user", status:res.status});

            }
        } catch(e) {
            addErrorNoti();
        }
    };
    async makeUserAdmin(member) {
        if (member.adminStatus) {
            return
        } else {
            try {
                let reqProps = {
                    method: 'POST',
                    headers: new Headers({
                        'content-type': 'application/json',
                        'user': AppStoreInstance.user.email + ":" + AppStoreInstance.user.password
                    }),
                    body: JSON.stringify({
                        email: member.email
                    })
                };
                let res = await fetch("/make_admin", reqProps);

                if (res.status === 200) {
                    addNotification(member.name + " added as admin to ")
                } else {
                    throw new Error({msg: "Can't remove exsiting user", status: res.status});
                }
            } catch(e) {
                addErrorNoti();
            }
        }
    }

    render() {
        return (
            <div className="admin-settings">
                <div className="contents-wrapper">
                <Link to="/"><i className="prev-arrow"/></Link>
                <div className="admin-title">Welcome {this.state.user ? this.state.user.name : ""}</div>
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
                                <th className="last-cell-row">
                                    {!(member.email === this.state.user.email) ?
                                    <div className="member-table-cell-remove-button" onClick={this.removeExistingUser.bind(this, member)}>
                                        Remove
                                    </div> :
                                    ""}
                                </th>
                                <th>
                                    {member.adminStatus === true || member.adminStatus === false ?
                                    <div className={"member-table-cell-admin-button" + (member.adminStatus ? "-disabled" : "")}
                                         onClick={this.makeUserAdmin.bind(this, member)}>
                                        {member.adminStatus ? "Admin" : "Make Admin"}
                                    </div> : "" }
                                </th>
                            </tr>)
                    })}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
}