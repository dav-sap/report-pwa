import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';



export default class DatePickerWrapper extends React.Component {

    static defaultProps = {
        numberOfMonths: 1,
    };

    handleDayClick = (day) => {
        const range = DateUtils.addDayToRange(day, {from:this.props.from, to:this.props.to});
        if (range.to && range.from) {
            this.props.updateDates(range);
        }
    };
    render() {
        const from = this.props.from;
        const to = this.props.to;
        const modifiers = { start: this.props.from, end: this.props.to};
        return (
            <div className="RangeExample">
                <div>
                    <div className="date-title">
                        <img alt="" className="date-img" src={process.env.PUBLIC_URL + "/dates.png"}/>
                            SELECT A DATE
                    </div>
                </div>
                <DayPicker
                    className="Selectable"
                    numberOfMonths={this.props.numberOfMonths}
                    selectedDays={[from, { from, to }]}
                    modifiers={modifiers}
                    showOutsideDays={true}
                    onDayClick={this.handleDayClick}
                />
            </div>
        );
    }
}
