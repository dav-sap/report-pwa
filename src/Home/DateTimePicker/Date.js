import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { observer } from 'mobx-react';




class Date extends React.Component {

    static defaultProps = {
        numberOfMonths: 1,
    };

    handleDayClick = (day) => {
        const range = DateUtils.addDayToRange(day, {from:this.props.store.dates.from, to:this.props.store.dates.to});
        if (range.to && range.from) {
            this.props.store.updateDates(range);
        }
    };
    
    render() {
        const from = this.props.store.dates.from;
        const to = this.props.store.dates.to;
        const modifiers = { start: this.props.store.dates.from, end: this.props.store.dates.to};
        return (
            <div className="RangeExample">

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
export default Date = observer(Date)