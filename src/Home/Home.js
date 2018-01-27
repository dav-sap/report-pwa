import React, { Component } from 'react';
import { Carousel} from 'antd';
import StatusScreen from './StatusScreen/StatusScreen'
import DateTimePicker from './DateTimePicker/DateTimePicker';
import { COLOR_MAP, STATUS, SERVER_URL} from './../Consts';
import {notification, Icon} from 'antd';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import SubmitScreen from './SubmitScreen/SubmitScreen'
import './home.css';
import './point-to-login.css'

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
        pointToLogin: false,

    };
    user = {};

    sendReport = () => {
        if (this.state.login) {
            this.setState({pointToLogin: true});
            return;
        }
        this.setState({loading: true});
        let startDate = new Date(this.state.dates.from.getFullYear(), this.state.dates.from.getMonth(), this.state.dates.from.getDate(), this.state.time.from.getHours(), this.state.time.from.getMinutes());
        let endDate = new Date(this.state.dates.to.getFullYear(), this.state.dates.to.getMonth(), this.state.dates.to.getDate(), this.state.time.to.getHours(), this.state.time.to.getMinutes());
        let reqProps = {
            method: 'POST',
            headers: new Headers({
                name: this.user.name,
                email: this.user.email,
                sub: this.user.subscription,
                startDate: startDate,
                endDate: endDate,
                status: this.state.status,
                note: this.state.note,
            })
        };
        fetch(SERVER_URL +"/add_report", reqProps)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error("Error Connecting");
                } else {
                    this.setState({loading: false});
                    this.next();
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

    next = () => {
        this.setState(prevState => {
            let nextSlideNum = prevState.slideNumber + 1;
            if (nextSlideNum === 2) nextSlideNum =0;
            return {slideNumber: nextSlideNum}
        }, () => this.refs.carousel.next())
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

            if (val && val.name && val.email && val.subscription) {
                let reqProps = {
                    method: 'POST',
                    headers: new Headers({
                        name: val.name,
                        email: val.email,
                        sub: JSON.stringify(val.subscription),
                    })
                };
                fetch(SERVER_URL + "/verify_user", reqProps)
                    .then(res => {
                        if (res.status === 202 || res.status === 200) {
                            this.setState({login: false});
                        } else if (res.status === 401) {
                            IdbKeyval.set('user', null).then(() =>{
                                this.setState({login: true});
                            });
                        }
                    })
                    .catch(err => {
                        console.log("Verify Failed: No server connection");
                    })
            } else {
                IdbKeyval.set('user', null).then(() =>{
                    this.setState({login: true});
                });
            }
        });


        IdbKeyval.get('waitAuth').then(val => {
            // console.log("UPDATING AUTH: "+ val);
            this.setState({
                waitAuth: val,
            });
        });


    }

    componentWillReceiveProps() {
        // IdbKeyval.get('waitAuth').then(val => {
        //     this.setState({
        //         waitAuth: val,
        //     });
        // });
        // IdbKeyval.get('user').then(val => {
        //     this.user = val;
        //     this.setState({
        //         login: (val === null) || (val === undefined),
        //     });
        // });
    }


    render() {
        return (
            <div className="App-wrapper" style={{opacity: this.state.loading ? 0.7 : 1,
                background: COLOR_MAP[this.state.status]}}>

                <div className="App" style={{width: "100%", maxWidth: "40rem", position: "relative", margin: "auto"}}>
                    {this.state.pointToLogin ? <div className="cover-div"/> : ""}
                    {this.state.pointToLogin ? <Icon type="arrow-up" className="arrow-bounce bounce"/> : ""}
                    <Header prevFunc={this.prev} status={this.state.status} slideNumber={this.state.slideNumber} dates={this.state.dates} time={this.state.time}/>
                    <Carousel ref="carousel" dots={false} swipe={false} afterChange={this.onChange}>
                        <div>
                            <StatusScreen nextFunc={(status) => setTimeout((status) =>  { this.setState({status: status}); this.next();}, 450, status) } prevFunc={this.prev}/>
                        </div>
                        <div>
                            <DateTimePicker updateDates={this.updateDates} timeChanged={this.timeChanged} time={this.state.time} status={this.state.status} dates={this.state.dates} nextFunc={this.next} prevFunc={this.prev}/>
                        </div>
                        <div>
                            <SubmitScreen changeNoteFunc={this.changeNote} status={this.state.status} note={this.state.note} login={this.state.login} prevFunc={this.prev} />
                        </div>
                        {/*<div>*/}
                            {/*<WhereInfo />*/}
                        {/*</div>*/}

                    </Carousel>

                    {this.state.slideNumber === 1 ? <Footer text="Save" nextFunc={() =>setTimeout(() => this.next(), 500)} />: ""}
                    {this.state.slideNumber === 2  ? <Footer text="Submit" nextFunc={() =>{ this.sendReport()}} />: ""}
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

