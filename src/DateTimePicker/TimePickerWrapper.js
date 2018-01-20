import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TimePicker from 'material-ui/TimePicker';

export default class TimePickerWrapper extends Component {
    handleChangeTime = (event, date) => {
        this.props.timeChanged(date, this.props.align)
    };
    render() {
        return (
            <div style={{width: "fit-content", margin: "auto"}}>
                <MuiThemeProvider>
                    <TimePicker
                        hintText="24hr Format"
                        format="24hr"
                        // defaultTime={new Date((new Date(this.props.defaultTime)).setMinutes(0))}
                        autoOk={true}
                        inputStyle={{ textAlign: this.props.align, cursor: 'pointer',  color:"white", fontSize:"1.6rem", fontWeight: 800}}
                        textFieldStyle={{width:"fit-content", paddingBottom: "17px"}}
                        minutesStep={10}
                        onChange={this.handleChangeTime}
                        value={this.props.time}
                    />
                </MuiThemeProvider>

            </div>
        );
    }
}