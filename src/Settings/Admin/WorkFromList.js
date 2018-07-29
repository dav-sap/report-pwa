import React, {PureComponent} from 'react';
import {Icon} from 'antd'
import {STATUS} from "../../Consts";
import {addErrorNoti} from "../../Utils";

class WorkFromList extends PureComponent {
    state = {
        wfOptions: [],
        newName: "",
        newEmoji:""
    };

    fetchWfOptions = async () => {
        let reqProps = {
            method: 'GET',
            headers: new Headers({
                'content-type': 'application/json',
                'user': this.props.store.user.email + ":" + this.props.store.user.password
            }),
        };
        let res = await fetch("/get_group_wf_options", reqProps);
        if (res.status === 200) {
            let resJson = await res.json();
            this.setState({
                wfOptions: resJson.options
            })
        }
    }

    removeOption = async (name) => {
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json',
                    'user': this.props.store.user.email + ":" + this.props.store.user.password
                }),
                body: JSON.stringify({
                    name: name,
                })
            };
            let response = await fetch("/remove_wf_option", reqProps);
            if (response.status === 200) {
                let resJson = await response.json();
                this.setState({wfOptions: resJson.group["wf_options"]});
            } else {
                addErrorNoti();
            }
        } catch (e) {
            addErrorNoti();
        }
    }

    addOption = async () => {
        try {
            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json',
                    'user': this.props.store.user.email + ":" + this.props.store.user.password
                }),
                body: JSON.stringify({
                    name: this.state.newName,
                    emoji:this.state.newEmoji
                })
            };
            let response = await fetch("/add_wf_option", reqProps);
            if (response.status === 200) {
                let resJson = await response.json();
                this.setState({wfOptions: resJson.group["wf_options"], newName: "", newEmoji: ""});
            } else {
                addErrorNoti();
            }
        } catch (e) {
            addErrorNoti();
        }
    }

    componentDidMount() {
        this.fetchWfOptions()
    }

    render() {
        return (
            <div className="work-from-list">
                <div className="sub-admin-title">Working From Options</div>
                <table className="members-table">
                    <tbody>
                    <tr key={this.state.wfOptions.length + 1} className="member-row">
                        <th><div className="member-table-cell">
                            <Icon type="plus-circle-o" onClick={this.addOption}/>
                        </div></th>
                        <th><div className="member-table-cell">
                            <input type="text" placeholder={"Name"} value={this.state.newName} onChange={(e) => this.setState({newName: e.target.value})}/>
                        </div></th>
                        <th><div className="member-table-cell">
                            <input type="text" placeholder={"Emoji"} value={this.state.newEmoji} onChange={(e) => this.setState({newEmoji: e.target.value})}/>
                        </div></th>
                    </tr>

                    {this.state.wfOptions.map((option, index) => {
                        return (
                            <tr key={index} className="member-row">
                                <th><div className="member-table-cell">
                                    {STATUS.FREE_STYLE === option.name ? <Icon type="check" /> :
                                        <Icon type="minus-circle-o" onClick={() => this.removeOption(option.name)} /> }
                                </div></th>
                                <th><div className="member-table-cell">{option.name}</div></th>
                                <th><div className="member-table-cell">{option.emoji}</div></th>
                            </tr>
                        )}
                    )}
                    </tbody>
                </table>

            </div>
        );
    }
}

export default WorkFromList;
