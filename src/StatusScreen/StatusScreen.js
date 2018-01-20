import React, { Component } from 'react';
import './status-screen.css'
import {COLOR_MAP} from './../Consts';

export default class StatusScreen extends Component {

    statusChosen = (val) => {
        this.props.nextFunc({status: val});
        // setTimeout( () => , 500);
    };
    render() {
        return (
            <div className="status-div">
                <div className="status-button even-button"  style={{background: COLOR_MAP["OOO"]}}
                        onClick={() => this.statusChosen("OOO")} ><div className="text-div">OOO</div></div>
                <div className="status-button"  style={{background: COLOR_MAP["WFH"]}}
                        onClick={() => this.statusChosen("WFH")} ><div className="text-div">WFH</div></div>
                <div className="status-button even-button"  style={{background: COLOR_MAP["SICK"]}}
                        onClick={() => this.statusChosen("SICK")} ><div className="text-div">SICK</div></div>

            </div>


        );
    }
}

