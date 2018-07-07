import React, { Component } from 'react';
import Time from'./Time'
import Date from './Date';
import './date-time-picker.css';
import { observer } from 'mobx-react';
import Power0 from 'gsap'
import TweenMax from 'gsap/TweenMax';
import Footer from './../Footer/Footer.js'
import { STATUS } from '../../Consts';

class DateTimePicker extends Component {

    getChosenDateTitle() {
        const from = this.props.store.dates.from;
        const to = this.props.store.dates.to;
        let fromStr = from.toLocaleString('en-En', {month: "short",day: "numeric"})
        let toStr = to.toLocaleString('en-En', {month: "short",day: "numeric"})
        return fromStr === toStr ? fromStr : fromStr + " - " + toStr
    }
    handleDatePickerClick = () => {
        if (this.props.store.allDay) {
            TweenMax.to(".time-picker-wrapper", 0.0, {opacity: 0});    
        }
        TweenMax.to(".all-day-wrapper", 0.0, {opacity: 0});
        TweenMax.to(".date-img", 0.0, {opacity: 0});

        TweenMax.to(".date-next-button", 0.7, {opacity: 0});    
        TweenMax.to(".date-title", 0.7, {width: 0, ease: Power0.easeOut});
        TweenMax.to(".RangeExample", 0.7, {height: 0, ease: Power0.easeOut});
        
        
        let el = document.getElementById(this.props.store.status);
        if (this.props.store.status === STATUS.WF) {
            TweenMax.to(".header-text", 0.2, {x: '-=75', delay: 1})
        } else if (this.props.store.status === STATUS.OOO) {
            TweenMax.to(".header-text", 0.2, {x: '-=53', delay: 1})
        }
        TweenMax.to(el, 0.2, {x: '+=45', delay: 1})
        TweenMax.to(el, 0.2, {y:'-=35', delay: 1.2})
        TweenMax.to(".date-chosen-text", 0.2, {y: '-=55', ease: Power0.easeOut, delay: 1.4});
        TweenMax.to(".time-picker-wrapper", 0.2, {y: '-=76', ease: Power0.easeOut, delay: 1.6});

        TweenMax.to(".date-time-picker-wrapper", 0.3, {zIndex: 1, delay: 1.8});
        TweenMax.to(".submit-screen", 0.3, {opacity: 1, zIndex: 2, delay: 1.8});
        
        setTimeout(() => this.props.store.nextSlide(), 2000);
    }
    render() {
        return (
            <div className="date-time-picker-wrapper body-wrapper">
                <div className="date-title">
                    <img alt="" className="date-img" src="/images/dates.png"/>
                        <div className="date-chosen-text" id="date-chosen-text"> {this.getChosenDateTitle()}</div>
                </div>
                <Date store={this.props.store} />
                <div className="time-picker-wrapper flex-row">
                    <div className="flex-row all-day-wrapper">
                        <input type="checkbox" id="c1" checked={this.props.store.allDay} onChange={this.props.store.changeAllDay}/><label htmlFor="c1">All Day</label>
                    </div>
                    {!this.props.store.allDay ?
                    <div className="flex-row time-wrapper">
                    <Time align="left" time={this.props.store.time.from} store={this.props.store} />
                    <div className="dash"/>
                    <Time align="right" time={this.props.store.time.to} store={this.props.store} />
                    </div>
                        : ""}
                </div>
                <Footer className="date-next-button" text="Save" nextFunc={this.handleDatePickerClick} />

            </div>
        );
    }
}
export default DateTimePicker = observer(DateTimePicker)