import React, { Component } from 'react';
import './status-screen.css'
import { observer } from 'mobx-react';
import {COLOR_MAP, STATUS} from './../../Consts';
import { Icon} from 'antd';
import Power0 from 'gsap'
import TweenMax from 'gsap/TweenMax';
import Footer from '../Footer/Footer'

class StatusScreen extends Component {
    state = {
        pointToLogin: false,
    }
    handleStatusClick = (event, statusChosen) => {
        if (this.props.store.user === null) {
            this.setState({pointToLogin: true});
            return;
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
                    onClick={(e) => this.handleStatusClick(e, STATUS.OOO)}></div>
                        <div className="text-div">Out of Office</div>
                </div>
                <div className="status-wrapper" id={STATUS.WF}>
                <div className="status-button" style={{background: COLOR_MAP[STATUS.WF]}}
                        onClick={(e) => this.handleStatusClick(e, STATUS.WF)} ></div><div className="text-div">Working From...</div>
                </div>
                <Footer className="status-next-button" text="Where is Everyone?" img="/images/everyone.png" nextFunc={() => this.props.history.push('/where-is-everyone')} />
            </div>


        );
    }
}
export default StatusScreen = observer(StatusScreen)

