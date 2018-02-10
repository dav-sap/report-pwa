import React, { Component } from 'react';
import './submit-screen.css'
import {CAPTION_MAP, IMAGE_MAP, STATUS} from './../../Consts';

export default class SubmitScreen extends Component {
    state = {
        // value: "Add Note",
        width: "60%",
        startedNote: false,
        finishedNote: false,
    };
    noteInput = null;

    handleChange = (event) => {
        this.props.changeNoteFunc(event.target.value);
    };
    handleSubmit = (event) => {
        if (event.which === 13 || event.keyCode === 13) {
            this.setState({
                width: "60%",
                finishedNote: true,
            })
        }
    };
    changeInput = () => {
        this.props.changeNoteFunc("");
       this.setState({
            width: "95%",
           startedNote: true,
           finishedNote: false,
        }, () => this.noteInput.focus());

    };
    focusOut = () => {
        this.setState({
            width: "60%",
            finishedNote: true,
        })
    };
    getValue = () => {
        if (!this.state.startedNote) {
            return "Add Note";
        }else {
            return this.props.note;
        }
    };

    render() {
        return (
            <div className="submit-screen">
                {CAPTION_MAP[this.props.status]}
                {IMAGE_MAP(this.props.status, "caption-img")}
                {this.props.status === STATUS.WF ? <div className="wf-option-wrapper">
                    <div className="flex-row button-row">
                        <div className={"wf-option " + (this.props.wfOption === "Home" ? "wf-option-clicked" : "") } onClick={() => this.props.wfOptionAdded("Home")}>Home</div>
                        <div className={"wf-option " + (this.props.wfOption === "IDC" ? "wf-option-clicked" : "") } onClick={() => this.props.wfOptionAdded("IDC")}>IDC</div>
                    </div>
                    <div className="flex-row button-row">
                        <div className={"wf-option " + (this.props.wfOption === "JER" ? "wf-option-clicked" : "") } onClick={() => this.props.wfOptionAdded("JER")}>JER</div>
                        <div className={"wf-option " + (this.props.wfOption === "PTK" ? "wf-option-clicked" : "") } onClick={() => this.props.wfOptionAdded("PTK")}>PTK</div>
                    </div>
                </div>: ""}
                    <fieldset disabled={this.state.width === "60%" ? "disabled" : ""}>
                        <input ref={(input) => { this.noteInput = input; }} id="note" type="text" value={this.getValue()} className="add-note bottom-button" onClick={this.changeInput}
                               style={{width: this.state.width}} onChange={this.handleChange} onKeyDown={this.handleSubmit} onBlur={this.focusOut}/>
                    </fieldset>
            </div>
        );
    }
}