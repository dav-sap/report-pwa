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
import { withRouter } from 'react-router-dom'

const IdbKeyval = require('idb-keyval');


class Home extends Component {
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
        wfOption: null,
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
        let noteToSend = this.state.wfOption !== null ?   this.state.wfOption + (this.state.note ? " - " + this.state.note : "") : this.state.note;
        let reqProps = {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify({
                name: this.user.name,
                email: this.user.email,
                sub: this.user.subscription,
                startDate: startDate,
                endDate: endDate,
                status: this.state.status,
                note: noteToSend,
            })
        };
        fetch(SERVER_URL +"/add_report", reqProps)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error("Error Connecting");
                } else {
                    this.setState({loading: false});
                    this.next();
                    this.props.history.push('/settings');
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
            if (nextSlideNum === 3) nextSlideNum =0;
            return {slideNumber: nextSlideNum}
        }, () => {
                this.refs.carousel.next();
                if (this.state.slideNumber === 0) {
                    this.setState({
                        status: STATUS.NO_STATUS,
                        dates: {from: new Date(), to: new Date()},
                        time: {from: this.getNewTime(8), to:this.getNewTime(17)},
                    })
                }

            })
    };

    prev = () =>  {
        this.setState(prevState => {
            let nextSlideNum = prevState.slideNumber - 1;
            if (nextSlideNum === -1) nextSlideNum = 0;
            return {slideNumber: nextSlideNum}
        }, () => {
            this.refs.carousel.prev();
            if (this.state.slideNumber === 0) {
                this.setState({status: STATUS.NO_STATUS, dates: {from: new Date(), to: new Date()}, time: {from: this.getNewTime(8), to: this.getNewTime(17)}})
            }

        })
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
    wfOptionAdded = (option) => {
        this.setState({
            wfOption: option
        })
    };
    getNewTime(hour) {
        let now = new Date();
        now.setHours(hour);
        now.setMinutes(0);
        return now;
    }
    verifyUser = async (user) => {
        let reqProps = {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                sub: user.subscription ? JSON.stringify(user.subscription) : {},
            })
        };
        try {
            let res = await fetch(SERVER_URL + "/verify_user", reqProps);
            if (res.status === 202 || res.status === 200) {
                let json = await res.json();
                console.log(json);
                await IdbKeyval.set('waitAuth', false);
                await this.setState({waitAuth: false, login: false});
                await IdbKeyval.set('user', JSON.parse(json.member));
                this.user = json.member;
                await this.setState({user:  JSON.parse(json.member)});

            } else if (res.status === 401) {
                IdbKeyval.set('user', null).then(() => {
                    IdbKeyval.set('waitAuth', false).then(() => {
                        this.setState({
                            waitAuth: false, login: true
                        });
                    });
                });
            } else {
                console.log("verify user unknown error");
                this.setState({login: false});
                const key = `open${Date.now()}`;
                notification.open({
                    message: '',
                    description: <p className="notification-text">Server Connection Failed</p>,
                    className: "notification-css",
                    key,
                });
            }
        } catch(err) {
            console.log("Verify Failed: No server connection");
            this.setState({login: false});
            const key = `open${Date.now()}`;
            notification.open({
                message: '',
                description: <p className="notification-text">Server Connection Failed</p>,
                className: "notification-css",
                key,
            });
        }
    }
    componentDidMount() {


        window['isUpdateAvailable']
            .then(isAvailable => {
                if (isAvailable) {
                    const key = `open${Date.now()}`;

                    notification.config({
                        duration: 30,

                    });
                    notification.open({
                        message: '',
                        description: <p className="notification-text">New Update available!<br/> Reload the App to see the latest juicy changes.</p>,
                        className: "notification-css",
                        icon: <Icon type="reload"  onClick={() => {notification.close(key);window.location.reload()}} style={{color: "white",position: "relative", top: "21px" }}/>,
                        key,
                    });
                }
            });
        IdbKeyval.get('user').then(val => {
            this.user = null;
            if (val && val.name && val.email) {
                this.user = val;
                this.verifyUser(val);
            } else {
                IdbKeyval.get('waitingUser').then((val) => {
                    console.log(val);
                    if (val && val.name && val.email) {
                        this.user = val;
                        this.verifyUser(val);
                    } else {
                        IdbKeyval.set('user', null).then(() =>{
                            this.setState({login: true});
                        });
                    }
                })
            }
        });


        IdbKeyval.get('waitAuth').then(val => {
            // console.log("UPDATING AUTH: "+ val);
            this.setState({
                waitAuth: val,
            });
        });


    }


    render() {
        return (
            <div className="App-wrapper" style={{opacity: this.state.loading ? 0.7 : 1,
                background: COLOR_MAP[this.state.status]}}>

                <div className="App" style={{width: "100%", maxWidth: "40rem", position: "relative", margin: "auto", maxHeight: "70rem"}}>
                    {this.state.pointToLogin ? <div className="cover-div"/> : ""}
                    {this.state.pointToLogin ? <Icon type="arrow-up" className="arrow-bounce bounce"/> : ""}
                    {this.state.pointToLogin ? <div className="who-r-u-text">Who Are You!?</div> : ""}
                    <Header prevFunc={this.prev} status={this.state.status} slideNumber={this.state.slideNumber} dates={this.state.dates} time={this.state.time}/>
                    <Carousel ref="carousel" dots={false} swipe={false}>
                        <div>
                            <StatusScreen nextFunc={(status) => setTimeout((status) =>  { this.setState({status: status}); this.next();}, 450, status) } prevFunc={this.prev}/>
                        </div>
                        <div>
                            <DateTimePicker updateDates={this.updateDates} timeChanged={this.timeChanged} time={this.state.time} status={this.state.status} dates={this.state.dates} nextFunc={this.next} prevFunc={this.prev}/>
                        </div>
                        <div>
                            <SubmitScreen changeNoteFunc={this.changeNote} status={this.state.status} note={this.state.note} login={this.state.login} wfOptionAdded={this.wfOptionAdded} wfOption={this.state.wfOption} prevFunc={this.prev} />
                        </div>
                    </Carousel>
                    {this.state.slideNumber === 0 ? <Footer text="Where is Everyone?" img="/images/everyone.png" nextFunc={() => this.props.history.push('/where-is-everyone')} />: ""}
                    {this.state.slideNumber === 1 ? <Footer text="Save" nextFunc={() =>setTimeout(() => this.next(), 500)} />: ""}
                    {this.state.slideNumber === 2  ? <Footer text="Submit" nextFunc={() =>{ this.sendReport()}} />: ""}
                    {/*<ul className="slick-dots-manual">*/}
                        {/*<li className={this.state.slideNumber === 0 ? "slick-active": ""}><div>1</div></li>*/}
                        {/*<li className={this.state.slideNumber === 1 ? "slick-active": ""}><div>2</div></li>*/}
                        {/*<li className={this.state.slideNumber === 2 ? "slick-active": ""}><div>3</div></li>*/}
                    {/*</ul>*/}

                </div>
            </div>
        );
    }
}
export default withRouter(Home);
