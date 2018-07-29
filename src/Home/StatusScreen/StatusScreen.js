import React, { Component } from 'react';
import './status-screen.css'
import { observer } from 'mobx-react';
import {COLOR_MAP, STATUS } from './../../Consts';
import {addErrorNoti} from './../../Utils'
import { Icon} from 'antd';
import Power0 from 'gsap'
import TweenMax from 'gsap/TweenMax';
import Footer from '../Footer/Footer'

const TODAY = "today";
const TOMORROW = "tomorrow";

class StatusScreen extends Component {
    state = {
        pointToLogin: false,
        arrivingClicked: false,
    }

    reportArriving = async (targetButton, otherButton, day) => {
        let startedAnimation =  new Date();

        try {
            TweenMax.to(targetButton, 0.3, {width: '50px',
                borderTop: "pink 3px solid", color: "transperant",
                ease: Power0.easeOut});
            TweenMax.to(otherButton, 0.4, {width: '0px', opacity: 0,
                color: "transperant",
                ease: Power0.easeOut});
            TweenMax.to(targetButton, 0.1, {borderRadius: "25px", delay: 0.2});
            TweenMax.to(targetButton, 0.1, {animation: "spin 1.2s linear infinite", delay: 0.3});


            let today = new Date();
            if (day === TOMORROW) {
                today.setDate(today.getDate() + 1);
            }
            today.setTime(today.getTime() + ((-1 * today.getTimezoneOffset()) * 60 * 1000));
            let todayStr = today.toISOString();
            todayStr = todayStr.substr(0, todayStr.lastIndexOf(':'));

            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json',
                    'user': this.props.store.user.email + ":" + this.props.store.user.password
                }),
                body: JSON.stringify({
                    email: this.props.store.user.email,
                    startDate: todayStr,
                    endDate: todayStr,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    status: STATUS.ARRIVING,
                    statusDesc: "",
                    note: "",
                    repeat: 0,
                    allDay: true,
                })
            };
            let response = await fetch("/add_report", reqProps);

            if (response.status !== 200) {
                addErrorNoti();
            }
            let timePassed = Math.round((new Date() - startedAnimation)/1000);
            setTimeout(() => this.props.history.push('/where-is-everyone'), (3 - timePassed) * 1000);

        } catch (e) {
            addErrorNoti();
            let timePassed = Math.round((new Date() - startedAnimation)/1000);
            setTimeout(() => this.props.history.push('/where-is-everyone'), (3 - timePassed) * 1000);
        }
    };

    handleStatusClick = (event, statusChosen) => {
        if (this.props.store.user === null) {
            this.setState({pointToLogin: true});
            return;
        }
        if (STATUS.ARRIVING === statusChosen) {
            setTimeout(() => {
                this.setState({arrivingClicked: true});
            }, 1520);
        }
        
        let el = (event.target || event.srcElement); // DOM uses 'target';
        let allEl = document.getElementsByClassName("status-wrapper");

        TweenMax.to(".status-button", 0.7, {width: 0, height: 0, ease: Power0.easeOut})
        TweenMax.to(".status-next-button", 0.7, {opacity: 0, ease: Power0.easeOut})
        
        
        el = el.parentNode
        TweenMax.to(el, 0.7, {height:0, delay: 0.7})
        
        for (let i = 0; i <allEl.length; i++) {
            TweenMax.to(allEl[i], 0.0, {borderWidth: '0px'})
            if (allEl[i] !== el) {
                TweenMax.to(allEl[i], 0.7, {x: '-=300', opacity: 0, delay: 0.7})
                TweenMax.to(allEl[i], 0.7, {height:0, delay: 0.7})
            }
        }
        if (STATUS.ARRIVING === statusChosen) return
        setTimeout(() => {
            this.props.store.updateStatus(statusChosen);
            this.props.store.nextSlide();
            TweenMax.to(".status-div", 0.0, {zIndex: 1})
            TweenMax.to(".app-body", 0.0, {zIndex: 1})
            TweenMax.to(".date-time-picker-wrapper", 0.2, {opacity: 1, zIndex: 2})

        }, 1500 )

    }
    render() {
        return (
            <div className="status-div body-wrapper">
            {this.state.pointToLogin ? <div className="cover-div"/> : ""}
            {this.state.pointToLogin ? <Icon type="arrow-up" className="arrow-bounce bounce"/> : ""}
            {this.state.pointToLogin ? <div className="who-r-u-text">Who Are You!?</div> : ""}
                <div className="status-wrapper" id={STATUS.OOO}>
                <div className="status-button" style={{background: COLOR_MAP[STATUS.OOO]}}
                    onClick={(e) => this.handleStatusClick(e, STATUS.OOO)}/>
                        <div className="text-div">Out of Office</div>
                </div>
                <div className="status-wrapper" id={STATUS.WF}>
                <div className="status-button" style={{background: COLOR_MAP[STATUS.WF]}}
                        onClick={(e) => this.handleStatusClick(e, STATUS.WF)} /><div className="text-div">Working From...</div>
                </div>
                <div className="status-wrapper" id={STATUS.ARRIVING}>
                <div className="status-button" style={{background: COLOR_MAP[STATUS.ARRIVING]}}
                        onClick={(e) => this.handleStatusClick(e, STATUS.ARRIVING)}/><div className="text-div">Arriving!</div>
                </div>
                {this.state.arrivingClicked ? <div className="center-button-container">
                    <div className="day-button" id="today-button" onClick={(e) => this.reportArriving(e.target, document.getElementById("tomorrow-button") ,TODAY)} >
                        Today
                    </div>
                    <div className="day-button" id="tomorrow-button" onClick={(e) => this.reportArriving(e.target, document.getElementById("today-button"), TOMORROW)} >
                        Tomorrow
                    </div>
                </div> : "" }
                <Footer className="status-next-button" text="Where is Everyone?" img="/images/everyone.png" nextFunc={() => this.props.history.push('/where-is-everyone')} />
            </div>


        );
    }
}
export default StatusScreen = observer(StatusScreen)

