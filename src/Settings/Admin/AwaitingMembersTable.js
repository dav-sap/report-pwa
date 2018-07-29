import React, {PureComponent} from 'react';
import {addErrorNoti} from "../../Utils";

class AwaitingMembersTable extends PureComponent {

    removeAwaitUser = async (member) =>{
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
                this.props.fetchMembers("/get_awaiting_members", 'awaitingMembers');
            } else {
                addErrorNoti();
            }
        } catch(e) {
            addErrorNoti();
        }
    };

    addAwaitUser = async (member)=>{
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
                this.props.fetchMembers("/get_all_members", 'members');
                this.props.fetchMembers("/get_awaiting_members", 'awaitingMembers');
            } else {
                addErrorNoti();
            }
        } catch(e) {
            addErrorNoti();
        }
    };

    render() {
        return (
            <div>
                {this.props.awaitingMembers.length > 0 || this.props.loading ?
                <div className="title-container">
                    <div className="sub-admin-title">Awaiting Approval</div>
                {this.props.loading ? <div className="admin-screen-loader"/> : ""}
                </div>
                : "" }
                <table className="members-table">
                    <tbody>
                    {this.props.awaitingMembers.map((member, index) => {
                        return (
                            <tr key={index} className="member-row">
                                <th><div className="member-table-cell">{member.name}</div></th>
                                <th><div className="member-table-cell">{member.email}</div></th>
                                <th>
                                    <div className="member-table-cell-images">
                                        <img src="/images/v.png" alt="add" className="add-member-button" onClick={() => this.addAwaitUser(member)}/>
                                        <img src="/images/x.png" alt="remove" className="remove-member-button" onClick={() => this.removeAwaitUser(member)}/>
                                    </div>
                                </th>
                            </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default AwaitingMembersTable;
