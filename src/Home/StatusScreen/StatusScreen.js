import React, { Component } from 'react';
import './status-screen.css'
import {COLOR_MAP} from './../../Consts';

export default class StatusScreen extends Component {

    state = {
        chosenStatus: ""
    }
    spanStyle = {height: "100%", zIndex: "1",opacity: "0.4", width: "100%"}
    statusChosen = (val) => {
        this.setState({
            chosenStatus: val,
        }, () => this.props.nextFunc(val));
    };
    componentWillReceiveProps() {
        this.setState({
            chosenStatus: "",
        })
    }

    render() {
        return (
            <div className="status-div">
                <div className="status-button even-button"  style={{background: COLOR_MAP["OOO"]}}
                        onClick={() => this.statusChosen("OOO")}><div className="text-div">OOO</div><span id="OOO" style={this.state.chosenStatus === 'OOO' ? this.spanStyle :{}}/></div>
                <div className="status-button odd-button"  style={{background: COLOR_MAP["WFH"]}}
                        onClick={() => this.statusChosen("WFH")} ><div className="text-div">WFH</div><span id="WFH" style={this.state.chosenStatus === 'WFH' ? this.spanStyle :{}}/></div>
                <div className="status-button even-button"  style={{background: COLOR_MAP["SICK"]}}
                        onClick={() => this.statusChosen("SICK")} ><div className="text-div">SICK</div><span id="SICK" style={this.state.chosenStatus === 'SICK' ? this.spanStyle :{}}/></div>

            </div>


        );
    }
}

