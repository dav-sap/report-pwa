import React, { Component } from 'react';
import {STATUS, SERVER_URL} from './../Consts';
import {notification} from 'antd'
import Status from './Status'
import {ServerBadResponseException} from '../Utils'
import './where-info.css';
import {Link } from 'react-router-dom';

const IdbKeyval = require('idb-keyval');
const TODAY = "today";
const TOMORROW = "tomorrow";

export default class WhereInfo extends Component {
    state = {
        today: {
            ooo: [],
            wfh: [],
            sick: [],
        },
        tomorrow: {
            ooo: [],
            wfh: [],
            sick: [],
        },
        day: TODAY,
    };
    fetchMembers = (stateToUpdate, date) => {
        let today = date;
        let reqProps = {
            method: 'GET',
        };

        fetch(SERVER_URL + "/get_members_status_by_date?date=" + today, reqProps)
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        if (stateToUpdate === TODAY) {
                            this.setState({today : {ooo: json.OOO, sick: json.SICK, wfh: json.WFH}});
                            IdbKeyval.set(TODAY, {ooo: json.OOO, sick: json.SICK, wfh: json.WFH})
                        }
                        if (stateToUpdate === TOMORROW) {
                            this.setState({tomorrow : {ooo: json.OOO, sick: json.SICK, wfh: json.WFH}});
                            IdbKeyval.set(TOMORROW, {ooo: json.OOO, sick: json.SICK, wfh: json.WFH})
                        }
                    })
                } else throw new ServerBadResponseException("No Internet Connection, or Server error", response.status);
            }).catch(err => {
                this.setState({loading: false});
                notification['error']({
                    message: 'Connection Error',
                    description: "dates are not updated",
                });
                console.error("Error updating dates")
            });
    };
    updateDates = () => {
        let today = new Date();

        this.fetchMembers(TODAY, today.toDateString());
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        this.fetchMembers(TOMORROW, tomorrow.toDateString());
    }
    componentDidMount() {
        IdbKeyval.get(TODAY).then((val) => {
            if (val !== undefined) {
                this.setState({today: val})
            }
        });
        IdbKeyval.get(TOMORROW).then((val) => {
            if (val !== undefined) {
                this.setState({tomorrow: val})
            }
        });
        this.updateDates();

    }

    render() {

        return (
            <div className="where-info">
                <Link to="/"><img className="prev-img" alt="Go back" src="/images/next-button.png"/></Link>
                    <div className="title-where-text">Where is<br/> Everyone?</div>
                    <Status key={0} title={STATUS.OOO} people={this.state[this.state.day].ooo}/>
                    <Status key={1} title={STATUS.WFH} people={this.state[this.state.day].wfh} />
                    <Status key={2} title={STATUS.SICK} people={this.state[this.state.day].sick} />
                    <div className="flex-row">
                    <div className="day-button" onClick={ () => {this.setState({day: TODAY});}} >
                        Today
                    </div>
                    <div className="day-button" onClick={ () => {this.setState({day: TOMORROW});}} >
                        Tomorrow
                    </div>
                    </div>

            </div>
        );
    }
}