import React, { Component } from 'react';
import TimePickerWrapper from'./TimePickerWrapper'
import DatePickerWrapper from './DatePickerWrapper';
import './date-time-picker.css';

export default class DateTimePicker extends Component {


    render() {

        return (
            <div className="date-time-picker-wrapper">
                <DatePickerWrapper updateDates={this.props.updateDates} status={this.props.status} from={this.props.dates.from} to={this.props.dates.to} defaultDate={new Date()} />
                <div className="time-picker-wrapper flex-row">
                    <TimePickerWrapper timeChanged={this.props.timeChanged} align="left" time={this.props.time.from}/>
                    <TimePickerWrapper timeChanged={this.props.timeChanged} align="right" time={this.props.time.to}/>
                </div>

            </div>
        );
    }
}