import React, {PureComponent} from 'react';
import {addErrorNoti, addNotification} from "../../Utils";


class MembersTable extends PureComponent {

    removeExistingUser = async (member) => {
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    email: member.email,
                    adminEmail: this.props.store.user.email
                })
            };
            let res = await fetch("/remove_member", reqProps);

            if (res.status === 200) {
                this.props.fetchMembers("/get_all_members", 'members');
            } else {
                throw new Error({msg:"Can't remove exsiting user", status:res.status});
            }

        } catch(e) {
            addErrorNoti();
        }
    };

    makeUserAdmin = async (member) =>{
        if (!member.adminStatus) {
            try {
                let reqProps = {
                    method: 'POST',
                    headers: new Headers({
                        'content-type': 'application/json',
                        'user': this.props.store.user.email + ":" + this.props.store.user.password
                    }),
                    body: JSON.stringify({
                        email: member.email
                    })
                };
                let res = await fetch("/make_admin", reqProps);

                if (res.status === 200) {
                    let resJson = await res.json();
                    addNotification(member.name + " added as admin to " + resJson.group);
                    this.props.fetchMembers("/get_all_members", 'members');
                } else {
                    addErrorNoti();
                }
            } catch(e) {
                addErrorNoti();
            }
        }
    };


    render() {
        return (
            <div>
                {this.props.members.length > 0 ? <div className="sub-admin-title">Members</div> : ""}
                <table className="members-table">
                    <tbody>
                    {this.props.members.map((member, index) => {
                        return (
                            <tr key={index} className="member-row">
                                <th><div className="member-table-cell">{member.name}</div></th>
                                <th><div className="member-table-cell">{member.email}</div></th>
                                <th className="last-cell-row">
                                    {!(member.email === this.props.store.user.email) ?
                                        <div className="member-table-cell-remove-button" onClick={() => this.removeExistingUser(member)}>
                                            Remove
                                        </div> :
                                        ""}
                                </th>
                                <th>
                                    {member.adminStatus === true || member.adminStatus === false ?
                                    <div className={"member-table-cell-admin-button" + (member.adminStatus ? "-disabled" : "")}
                                         onClick={() => this.makeUserAdmin(member)}>
                                        {member.adminStatus ? "Admin" : "Make Admin"}
                                    </div> : "" }
                                </th>
                            </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default MembersTable;
