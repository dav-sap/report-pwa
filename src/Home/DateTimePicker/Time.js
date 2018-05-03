import React, { Component } from 'react';
import { observer } from 'mobx-react';

class Time extends Component {
    state = {
        time: "00:00"
    }
    componentWillReceiveProps(nextProps) {   
        this.setState({time: nextProps.time});
    }
    componentDidMount() {
        let time = this.props.align === "right" ? "17:00" : "08:00";
        this.setState({time: time});
    }
    handleChangeTime = (event, date) => {
        
        if (event.target.value === "") {
            let time = this.props.align === "right" ? "17:00" : "08:00";
            this.props.store.updateTime(time, this.props.align)    
        } else {
            this.props.store.updateTime(event.target.value, this.props.align)
        }
    };
    render() {
        let pos = this.props.align === "right" ? {right: "-10px"} : {left: "0"};
        return (
            <div className="time-picker" style={pos}>
                <input id="time-picker" type="time" name="time" value={this.state.time} onChange={this.handleChangeTime} style={pos}/>
            </div>
        );
    }
}
export default Time = observer(Time)