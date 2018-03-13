import React, { Component } from 'react';
import {STATUS, SERVER_URL} from './../Consts';
import {notification} from 'antd'
import Status from './Status'
import {ServerBadResponseException} from '../Utils'
import './where-info.css';
import {Link } from 'react-router-dom';

const TODAY = "today";
const TOMORROW = "tomorrow";

export default class WhereInfo extends Component {
    state = {
        today: {
            ooo: [],
            wf: [],
            sick: [],
        },
        tomorrow: {
            ooo: [],
            wf: [],
            sick: [],
        },
        day: TODAY,
        loading: false,
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
                            this.setState({today : {ooo: json.OOO, sick: json.SICK, wf: json.WF}, loading: false});

                        }
                        if (stateToUpdate === TOMORROW) {
                            this.setState({tomorrow : {ooo: json.OOO, sick: json.SICK, wf: json.WF}});
                        }
                    })
                } else throw new ServerBadResponseException("No Internet Connection, or Server error", response.status);
            }).catch(err => {
                this.setState({loading: false});
                if (stateToUpdate === TODAY) {
                    const key = `open${Date.now()}`;
                    notification.open({
                        message: '',
                        description: <p className="notification-text">Server Connection Failed</p>,
                        className: "notification-css",
                        key,
                    });
                }
                console.error("Error updating dates")
            });
    };
    updateDates = () => {
        this.setState({loading: true});
        let today = new Date();

        this.fetchMembers(TODAY, today.toDateString());
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        this.fetchMembers(TOMORROW, tomorrow.toDateString());
    }
    componentDidMount() {
        this.updateDates();
    }

    render() {

        return (
            <div className="where-wrapper">
                <div className="where-info">
                    <Link to="/"><img className="prev-img" alt="Go back" src="/images/next-button.png"/></Link>
                        <div className="title-where-text">Where is Everyone?</div>
                        <Status key={0} title={STATUS.OOO} loading={this.state.loading} people={this.state[this.state.day].ooo}/>
                        <Status key={1} title={STATUS.WF} loading={this.state.loading} people={this.state[this.state.day].wf} />
                        <Status key={2} title={STATUS.SICK} loading={this.state.loading} people={this.state[this.state.day].sick} />
                        <div className="flex-row bottom-button-wrapper">
                            <div className={this.state.day === TODAY ? "day-button-clicked" : "day-button"} onClick={ () => {this.setState({day: TODAY});}} >
                                Today
                            </div>
                            <div className={this.state.day === TOMORROW ? "day-button-clicked" : "day-button"} onClick={ () => {this.setState({day: TOMORROW});}} >
                                Tomorrow
                            </div>
                        </div>

                </div>
            </div>
        );
    }
}