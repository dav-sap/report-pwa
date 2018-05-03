import React, { Component } from 'react';
import './submit-screen.css'
import {SUB_STATUS, SLIDER_SETTINGS, SERVER_URL} from './../../Consts';
import { observer } from 'mobx-react';
import { Icon} from 'antd';
import LoadingCircle from "./../../LoadingCircle";
import {addErrorNoti} from './../../Utils';
import Footer from './../Footer/Footer'
import Slider from "react-slick";

class SubmitScreen extends Component {
    state = {
        startedNote: false,
        finishedNote: false,
        loading:false,
        subStatusNum: 0
    };
    
    noteInput = null;
    
    handleChange = (event) => {
        this.props.store.changeNote(event.target.value);
    };
    handleSubmit = (event) => {
        if (event.which === 13 || event.keyCode === 13) {
            this.setState({
                finishedNote: true,
            })
        }
    };
    changeInput = () => {
        this.props.store.changeNote("");
       this.setState({
           startedNote: true,
           finishedNote: false,
        }, () => this.noteInput.focus());

    };
    focusOut = () => {
        this.setState({
            finishedNote: true,
        })
    };
    getValue = () => {
        if (!this.state.startedNote) {
            return "Add Note";
        }else {
            return this.props.store.note;
        }
    };
    sendReport = () => {
        this.setState({loading: true});
        let startDate = `${this.props.store.dates.from.getFullYear()}-${this.props.store.dates.from.getMonth() + 1}-${this.props.store.dates.from.getDate()}T${this.props.store.time.from.split(":")[0]}:${this.props.store.time.from.split(":")[1]}`
        let endDate = `${this.props.store.dates.to.getFullYear()}-${this.props.store.dates.to.getMonth() + 1}-${this.props.store.dates.to.getDate()}T${this.props.store.time.to.split(":")[0]}:${this.props.store.time.to.split(":")[1]}`
        let reqProps = {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify({
                name: this.props.store.user.name,
                email: this.props.store.user.email,
                sub: this.props.store.user.subscription,
                startDate: startDate,
                endDate: endDate,
                status: this.props.store.status,
                statusDesc: this.props.store.statusDesc,
                note: this.props.store.note,
                repeat: this.props.store.repeat
            })
        };
        fetch(SERVER_URL +"/add_report", reqProps)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error("Error Connecting");
                } else {
                    this.setState({loading: false});
                    this.props.store.resetAll();   
                    this.props.history.push('/where-is-everyone');
                }
            })
            .catch(err => {
                this.setState({loading: false});
                addErrorNoti();
                console.error("Error send report")
            });


    };
    getRepeatStr = () => {
        let from = this.props.store.dates.from
        let to = this.props.store.dates.to
        if (from.setHours(0,0,0,0) === to.setHours(0,0,0,0)) {
            return <div className="repeat-text-wrapper">{"Every " + from.toLocaleString('en-En', {weekday: "long"}) + " for "}
                <input type="number" value={this.props.store.repeat} className="input-weeks" onChange={(event) => this.props.store.updateRepeat(event.target.value)}/> {" weeks"} </div>
        } return ""
    }
    afterChange = (item) => {
        this.setState({
            subStatusNum: item
        })
        this.props.store.addStatusDesc(SUB_STATUS[this.props.store.status][item].props.children[1].props.children)
    }
    componentDidMount() {
        this.props.store.addStatusDesc("Free Style");
    }
    
    itemClicked(index) {
        let itemsLen = SUB_STATUS[this.props.store.status].length - 1;
        if (this.state.subStatusNum === itemsLen && index === 0) {
            this.slider.slickGoTo(itemsLen + 1);
        } else if (this.state.subStatusNum === 0 && index === itemsLen) {
            this.slider.slickGoTo(-1);
        } else this.slider.slickGoTo(index)
        
    }
    render() {
        
        return (
            <div className="submit-screen body-wrapper">
            {this.state.loading ? <LoadingCircle/>: ""}
            {this.state.loading? <div className="cover-div"/> : ""}
                <div className="repeat-options">
                    {this.getRepeatStr()}
                </div>
                <Slider ref={(input) => { this.slider = input; }} {...SLIDER_SETTINGS} afterChange={this.afterChange}>
                    {SUB_STATUS[this.props.store.status] ? SUB_STATUS[this.props.store.status].map((item, index) => {
                        return <div className="item-slider-wrapper" onClick={() =>this.itemClicked(index)}>{item}</div>
                    }) : ""}
                </Slider>
                {this.state.subStatusNum === 0 && !this.state.finishedNote? <div className="arrow-wrapper"><Icon type="arrow-down" className="arrow-freestyle bounce"/></div> : ""}
                
                <input ref={(input) => { this.noteInput = input; }} id="note" type="text" value={this.getValue()} className="add-note" onClick={this.changeInput}
                        onChange={this.handleChange} onKeyDown={this.handleSubmit} onBlur={this.focusOut}/>

                <Footer className="submit-next-button" text="Submit" nextFunc={() =>{ this.sendReport()}} />
            </div>
        );
    }
}
export default SubmitScreen = observer(SubmitScreen)