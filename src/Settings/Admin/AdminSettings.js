import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import {addErrorNoti, addNotificationWithQuestion} from './../../Utils';
import AppStoreInstance from "./../../AppStore";
import './admin-settings.css';
import MembersTable from "./MembersTable";
import WorkFromList from "./WorkFromList";
import {addNotification} from "../../Utils";
import AwaitingMembersTable from "./AwaitingMembersTable";
const IdbKeyval = require('idb-keyval');

export default class AdminSettings extends Component {
    state = {
        members: [],
        awaitingMembers: [],
        user: undefined,
    }

    fetchMembers = async (url, stateMembersToChange) => {
        try {

            let reqProps = {
                method: 'GET',
                headers: new Headers({
                    'content-type': 'application/json',
                    'user': this.state.user.email + ":" + this.state.user.password
                }),
            };

            let res = await fetch(url, reqProps);

            if (res.status === 200) {
                let json = await res.json();

                this.setState({
                    [stateMembersToChange]: JSON.parse(JSON.stringify(json.members))
                }, () => {
                    if (stateMembersToChange === "members") {
                        let copyMembers = this.state.members;
                        this.state.members.forEach( (member, index) => {

                            let reqProps = {
                                method: 'GET',
                            };
                            fetch("/get_admin_status?email=" + member.email, reqProps).then((response) => {
                                if (response.status === 200) {
                                    response.json().then((resJson) => {
                                        copyMembers.map((newMember) => {
                                            if (member.email.toLowerCase() === newMember.email.toLowerCase()) {
                                                newMember.adminStatus = resJson.admin;
                                                return newMember;
                                            } else return newMember;

                                        })
                                        if (index === this.state.members.length - 1) {
                                            this.setState({membersLoading: false})
                                        }
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
                addErrorNoti();
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
            this.setState({membersLoading: true});
            this.fetchMembers("/get_all_members", 'members');
            this.setState({awaitMembersLoading: true});
            this.fetchMembers("/get_awaiting_members", 'awaitingMembers').then(() => {
                this.setState({
                    awaitMembersLoading: false,
                })
            })
        }
    }

    removeGroup = async () => {
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json',
                    'user': this.state.user.email + ":" + this.state.user.password
                })
            };
            let res = await fetch("/remove_group", reqProps);

            if (res.status === 200) {
                let resJson = await res.json();
                addNotification("Group " + resJson.group + " Removed! You will now be removed");
                setTimeout(() => this.props.history.push("/settings"), 3000)
            } else {
                addErrorNoti();
            }
        } catch(e) {
            addErrorNoti();
        }
    }

    closeGroupNotification = () => {
        addNotificationWithQuestion(
            "This will delete the group all the members in it, are you sure you want to do this?",
            {handlerFunc: this.removeGroup , text: "Yes"},
            {handlerFunc:() => {} , text: "No"},
        )
    }

    render() {
        return (
            <div className="admin-settings">
                <div className="contents-wrapper">
                    <Link to="/"><i className="prev-arrow"/></Link>
                    <div className="admin-title">
                        Admin Settings - Welcome {this.state.user ? this.state.user.name : ""}
                    </div>
                    <div className="member-table-cell-remove-button close-group-button" onClick={this.closeGroupNotification}>
                        Close Group
                    </div>
                    <AwaitingMembersTable loading={this.state.awaitMembersLoading} awaitingMembers={this.state.awaitingMembers}  store={AppStoreInstance} fetchMembers={this.fetchMembers}/>
                    <MembersTable loading={this.state.membersLoading} members={this.state.members} store={AppStoreInstance} fetchMembers={this.fetchMembers}/>
                    {this.state.user ? <WorkFromList store={AppStoreInstance}/> : "" }
                </div>
            </div>
        );
    }
}