import React, { Component } from 'react';
import { Carousel} from 'antd';
import StatusScreen from './StatusScreen/StatusScreen'
import DateTimePicker from './DateTimePicker/DateTimePicker';
import { COLOR_MAP, STATUS, SERVER_URL} from './../Consts';
import {Icon, notification} from 'antd';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SubmitScreen from './SubmitScreen/SubmitScreen'
// import WhereInfo from './WhereInfo/WhereInfo';

const IdbKeyval = require('idb-keyval');


export default class Home extends Component {
    state = {
        status: STATUS.NO_STATUS,
        login: true,
        slideNumber: 0,
        note: "",
        dates: {from: new Date(), to: new Date()},
        time: {from: this.getNewTime(8), to:this.getNewTime(17)},
        waitAuth: false,
        key: 0,

    };
    user = {};

    sendReport = () => {
        let startDate = new Date(this.state.dates.from.getFullYear(), this.state.dates.from.getMonth(), this.state.dates.from.getDate(), this.state.time.from.getHours(), this.state.time.from.getMinutes());
        let endDate = new Date(this.state.dates.to.getFullYear(), this.state.dates.to.getMonth(), this.state.dates.to.getDate(), this.state.time.to.getHours(), this.state.time.to.getMinutes());
        let reqProps = {
            method: 'POST',
            headers: new Headers({
                name: this.user,
                startDate: startDate,
                endDate: endDate,
                status: this.state.status,
                note: this.state.note,

            })
        };
        fetch(SERVER_URL +"/add_report", reqProps)
            .then(res => {
                if (res.status !== 200) {
                    throw {msg: "Error Connecting"};
                } else {
                    this.setState({loading: false});
                    this.next({note:this.state.note});
                }
            })
            .catch(err => {
                this.setState({loading: false});
                notification['error']({
                    message: 'Connection Error',
                    description: "No Internet Connection, or server is offline",
                });
                console.error("Error send report")
            });


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

    updateUserStatus = () => {
        this.setState({
            login: true,
        });
    };

    componentDidMount() {
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
        IdbKeyval.get('user').then(val => {
            this.user = val;
            if (val.name && val.email && val.sub) {
                let reqProps = {
                    method: 'POST',
                    headers: new Headers({
                        name: val.name,
                        email: val.email,
                        sub: val.sub,
                    })
                };
                fetch(SERVER_URL + "/verify_user", reqProps)
                    .then(res => {
                        if (res.status !== 200) {
                            throw {msg: "Connection Error. "};
                        } else {
                            IdbKeyval.set('user', res.member);
                        }
                    })
                    .catch(err => {
                        throw err
                    })
            }
            this.setState({
                login: val === (null || undefined),
            });
        });


        IdbKeyval.get('waitAuth').then(val => {
            // console.log("UPDATING AUTH: "+ val);
            this.setState({
                waitAuth: val,
            });
        });


    }

    componentWillReceiveProps() {
        IdbKeyval.get('waitAuth').then(val => {
            // console.log("UPDATING Auth: "+ val);
            this.setState({
                waitAuth: val,
            });
        });
        IdbKeyval.get('user').then(val => {
            // console.log("UPDATING User: "+ val);
            this.setState({
                user: val,
            });
        });
    }



    render() {
        return (
            <div className="App-wrapper" style={{opacity: this.state.loading ? 0.7 : 1, background: this.state.slideNumber !== 3 ? COLOR_MAP[this.state.status] : "#635656"}}>
                <div className="App">
                    {this.state.loading ? <Icon className="loading-icon" type="loading" spin={true}/>: ""}
                    <Header prevFunc={this.prev} status={this.state.status} updateUserStatus={this.updateUserStatus} unsubscribeUser={this.unsubscribeUser} slideNumber={this.state.slideNumber} dates={this.state.dates} time={this.state.time}/>
                    <Carousel ref="carousel" dots={false} swipe={false} afterChange={this.onChange}>
                        <div>
                            <StatusScreen nextFunc={this.next} prevFunc={this.prev}/>
                        </div>
                        <div>
                            <DateTimePicker updateDates={this.updateDates} timeChanged={this.timeChanged} time={this.state.time} status={this.state.status} dates={this.state.dates} nextFunc={this.next} prevFunc={this.prev}/>
                        </div>
                        {/*{this.state.login ? <div>*/}
                            {/*<Login waitAuth={this.state.waitAuth} status={this.state.status} dates={this.state.dates} nextFunc={this.next} prevFunc={this.prev} changeFullName={this.changeFullName} changeEmail={this.changeEmail} />*/}
                        {/*</div> : ""}*/}
                        <div>
                            <SubmitScreen changeNoteFunc={this.changeNote} status={this.state.status} note={this.state.note} prevFunc={this.prev} />
                        </div>
                        {/*<div>*/}
                            {/*<WhereInfo />*/}
                        {/*</div>*/}

                    </Carousel>

                    {this.state.slideNumber === 1 ? <Footer text="Save" nextFunc={() => this.next({dates: this.state.dates, time: this.state.time})} />: ""}
                    {this.state.slideNumber === 2 && !this.state.login? <Footer text="Save" nextFunc={() =>{ this.setState({loading: true});this.sendReport()}} />: ""}
                    {this.state.slideNumber === 2 && this.state.login ? <Footer text="Register" nextFunc={() => {this.setState({loading: true});this.subscribeUser(this.tempUserName, this.tempEmailName);}} />: ""}
                    <ul className="slick-dots-manual">
                        <li className={this.state.slideNumber === 0 ? "slick-active": ""}><div>1</div></li>
                        <li className={this.state.slideNumber === 1 ? "slick-active": ""}><div>2</div></li>
                        <li className={this.state.slideNumber === 2 ? "slick-active": ""}><div>3</div></li>
                    </ul>

                </div>
            </div>
        );
    }
}

