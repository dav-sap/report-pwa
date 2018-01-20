import React, { Component } from 'react';
import './App.css';
import { Carousel} from 'antd';
import StatusScreen from './StatusScreen/StatusScreen'
import DateTimePicker from './DateTimePicker/DateTimePicker';
import { COLOR_MAP, STATUS} from './Consts';
import Login from './Login/Login';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SubmitScreen from './SubmitScreen/SubmitScreen'
import WhereInfo from './WhereInfo/WhereInfo';

import {unsubscribeUser, subscribeUser} from './Utils';
const IdbKeyval = require('idb-keyval');

export default class App extends Component {
    state = {
        status: STATUS.NO_STATUS,
        login: false,
        slideNumber: 0,
        note: "",
        dates: {from: new Date(), to: new Date()},
        time: {from: this.getNewTime(8), to:this.getNewTime(17)},

    };
    user = null;


    tempUserName = "";
    tempEmailName = "";
    changeFullName = (fn) => {
        this.tempUserName= fn;
    };

    changeEmail = (email) => {
        this.tempEmailName = email;
    };

    next = (json) => {
        if (this.state.slideNumber === 0) {
            this.setState({slideNumber: 1, status: json.status}, () =>this.refs.carousel.next());
        } else if (this.state.slideNumber === 1) {
            this.setState({slideNumber: 2, dates: json.dates, time: json.time}, () =>this.refs.carousel.next());
        } else if (this.state.slideNumber === 2) {
            this.setState({
                note: json.note, slideNumber: 3, completed: true,
        }, () => this.refs.carousel.next());
        }else this.refs.carousel.next();
    };

    onChange = (slide) => {
        if (slide === 0) {
            this.setState({
                status: STATUS.NO_STATUS,
                dates: {from: new Date(), to: new Date()},
                time: {from: this.getNewTime(8), to:this.getNewTime(17)},
                slideNumber: slide,
                note: "",
            })
        }
        if (slide === 1) {
            this.setState({
                slideNumber: slide,
                note: "",
            })
        } else if ( slide === 2) {
            this.setState({
                slideNumber: slide,
            })
        } else this.setState({slideNumber: slide});
    };

    prev = (slide) =>  {
        if (slide === 0) {
            this.setState({
                status: STATUS.NO_STATUS,
                dates: {from: new Date(), to: new Date()},
                time: {from: this.getNewTime(8), to:this.getNewTime(17)},
                slideNumber: slide,
                note: "",
            }, () => this.refs.carousel.prev())
        }
        if (slide === 1) {
            this.setState({
                slideNumber: slide,
                note: "",
            }, () => this.refs.carousel.prev())
        } else if ( slide === 2) {
            this.setState({
                slideNumber: slide,
            }, () => this.refs.carousel.prev())
        } else this.setState({slideNumber: slide}, () => this.refs.carousel.prev());
    };

    goTo = (slide) =>  {
        this.refs.carousel.goTo(slide);
    };

    changeNote = (note) => {
        this.setState({
            note:note,
        })
    };

    updateDates = (dates) => {
        this.setState({
            dates: dates
        });
    };

    timeChanged = (date, align) => {

        if (align === "left") {
            this.setState({time: {from: date, to: this.state.time.to}})
        }
        if (align === "right") {
            this.setState({time: {from: this.state.time.from, to:date}})
        }
    };

    getNewTime(hour) {
        let now = new Date();
        now.setHours(hour);
        now.setMinutes(0);
        return now;
    }

    componentDidMount() {
        IdbKeyval.get('user').then(val => {
            console.log("value:" + val);
            this.user = val;
            this.setState({
                login: val === null,
            });
        });
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {
            console.log("This site already granted Notifications!");
        }
        else if (Notification.permission !== 'denied' || Notification.permission === "default") {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    console.log("Granted permission for notifications!");
                }
            })
        }

    }

  render() {
    return (
      <div className="App no-status-background" style={{opacity: 1, background: this.state.slideNumber !== 3 ? COLOR_MAP[this.state.status] : "#635656"}}>

          <Header prevFunc={this.prev} status={this.state.status} slideNumber={this.state.slideNumber} dates={this.state.dates} time={this.state.time}/>
          <Carousel ref="carousel" dots={false} swipe={false} afterChange={this.onChange}>
              <div>
                  <StatusScreen nextFunc={this.next} prevFunc={this.prev}/>
              </div>
              <div>
                  <DateTimePicker updateDates={this.updateDates} timeChanged={this.timeChanged} time={this.state.time} status={this.state.status} dates={this.state.dates} nextFunc={this.next} prevFunc={this.prev}/>
              </div>
              {this.state.login ? <div>
                    <Login status={this.state.status} dates={this.state.dates} nextFunc={this.next} prevFunc={this.prev} changeFullName={this.changeFullName} changeEmail={this.changeEmail} />
              </div> : ""}
             <div>
                  <SubmitScreen changeNoteFunc={this.changeNote} status={this.state.status} note={this.state.note} prevFunc={this.prev} />
             </div>
             <div>
                 <WhereInfo />
             </div>

          </Carousel>

          {this.state.slideNumber === 1 ? <Footer text="Save" nextFunc={() => this.next({dates: this.state.dates, time: this.state.time})} />: ""}
          {this.state.slideNumber === 2 && !this.state.login? <Footer text="Save" nextFunc={() => this.next({note:this.state.note})} />: ""}
          {this.state.slideNumber === 2 && this.state.login ? <Footer text="Register" nextFunc={() => subscribeUser(this.tempUserName, this.tempEmailName)} />: ""}
          {/*{this.state.slideNumber === 3 ? <Footer text="Exit" nextFunc={() =>{ window.open(location, '_self').close();}} />: ""}*/}
          <ul className="slick-dots-manual">
              <li className={this.state.slideNumber === 0 ? "slick-active": ""}><div>1</div></li>
              <li className={this.state.slideNumber === 1 ? "slick-active": ""}><div>2</div></li>
              <li className={this.state.slideNumber === 2 ? "slick-active": ""}><div>3</div></li>
              {/*<li className={this.state.slideNumber === 3 ? "slick-active": ""}><div>4</div></li>*/}
          </ul>

      </div>
    );
  }
}

