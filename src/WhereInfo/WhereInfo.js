import React, { Component } from 'react';
import {STATUS, SERVER_URL} from './../Consts';
import Status from './Status'
import {addErrorNoti, onlyUnique} from './../Utils';
import './where-info.css';
import {Link } from 'react-router-dom';

const TODAY = "today";
const TOMORROW = "tomorrow";

export default class WhereInfo extends Component {
    state = {
        today: {
            ooo: [],
            wf: [],
        },
        tomorrow: {
            ooo: [],
            wf: [],
        },
        day: TODAY,
        loading: false,
        arriving: []
    };
    updateDatesInterval = null;

    parseReports(reports, stateToUpdate) {
        let ooo = [];
        let wf = [];
        reports.forEach((report) => {
            switch (report.status) {
                case "OOO":
                    ooo.push(report);
                    break;
                case "WF":
                    wf.push(report);
                    break;
                default:
                    console.log("No matching Status")
            }
        })
        if (stateToUpdate === TODAY) {
            this.setState({today : {ooo: ooo, wf:wf}, loading: false});

        }
        if (stateToUpdate === TOMORROW) {
            this.setState({tomorrow : {ooo: ooo, wf:wf}});
        }
    }
    fetchMembers = async (stateToUpdate, date) => {
        let today = date;
        let reqProps = {
            method: 'GET',
        };

        fetch(SERVER_URL + "/get_members_status_by_date?date=" + today, reqProps)
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        this.parseReports(json.reports, stateToUpdate)
                        
                    })
                } else throw new Error({msg:"No Internet Connection, or Server error", status:response.status});
            }).catch(err => {
                this.setState({loading: false});
                if (stateToUpdate === TODAY) {
                    addErrorNoti();
                }
                console.error("Error updating dates")
            });
        if (stateToUpdate === TODAY) {
            fetch(SERVER_URL + "/get_arriving", reqProps)
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((json) => {
                        this.setState({arriving: json.members.filter( onlyUnique ), loading: false});
                    })
                } else throw new Error({msg:"No Internet Connection, or Server error", status:response.status});
            }).catch(err => {
                this.setState({loading: false});
                addErrorNoti();
                console.error("Error updating dates")
            });
        }
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
        this.updateDatesInterval = setInterval(() => this.updateDates(), 120000);
    }
    componentWillUnmount() {
        clearInterval(this.updateDatesInterval);
    }
    render() {

        return (
            <div className="where-wrapper">
                <div className="where-info">
                    <Link to="/"><i className="prev-arrow"/></Link>
                        <div className="title-where-text">Where is Everyone?</div>
                        <Status key={0} title={STATUS.OOO} loading={this.state.loading} reports={this.state[this.state.day].ooo}/>
                        <Status key={1} title={STATUS.WF} loading={this.state.loading} reports={this.state[this.state.day].wf} />
                        {this.state.day === TODAY ? <Status key={2} title={STATUS.ARRIVING} loading={this.state.loading} reports={this.state.arriving} /> : ""}
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