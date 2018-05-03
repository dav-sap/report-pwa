import { action, extendObservable } from 'mobx';
import { STATUS, SERVER_URL} from './Consts';
import {addErrorNoti} from './Utils';
const IdbKeyval = require('idb-keyval');

class AppStore {
    constructor() {
        extendObservable(this, {
            status: STATUS.NO_STATUS,            
            note: "",
            dates: {from: new Date(), to: new Date()},
            time: {from: "08:00", to:"17:00"},
            waitAuth: false,
            key: 0,
            slideNumber: 0,
            statusDesc: null,
            repeat: 0,
            user: null,
            waitingUser: null
        })
    }
    
    nextSlide = action('nextSlide', () => {
        this.slideNumber = this.slideNumber + 1;
    });
    prevSlide = action('prevSlide', () => {
        if (this.slideNumber - 1 === 0) {
            this.status = STATUS.NO_STATUS;
            this.dates = {from: new Date(), to: new Date()}
            this.time = {from: "08:00", to: "17:00"};
        }
        this.slideNumber = this.slideNumber - 1;        
    });
    updateStatus = action('updateStatus', (status) => {
        this.status = status;       
    });
    resetAll = action('resetAll', () => {
        this.status = STATUS.NO_STATUS;
        this.note = "";
        this.dates = {from: new Date(), to: new Date()};
        this.time = {from: "08:00", to:"17:00"};
        this.slideNumber = 0;
        this.statusDesc = null;
        this.repeat = 0;
    })
    changeNote = action('changeNote', (note) => {    
        this.note = note;
    });

    updateDates = action('updateDates', (dates) => {
        this.dates = dates;
    });
    
    updateRepeat = action('updateRepeat', (repeat) => {
        this.repeat = repeat;
    });
    updateTime = action('updateTime', (time, align) => {

        if (align === "left") {
            this.time = {from: time, to: this.time.to}
        }
        if (align === "right") {
            this.time = {from: this.time.from, to:time}
        }
    });
    addStatusDesc = action('addStatusDesc', (statusDesc) => {
        this.statusDesc = statusDesc;
    });
    updateWaitAuth = action('updateWaitAuth', (waitAuth) => {
        this.waitAuth = waitAuth;
    });
    updateUser = action('updateUser', (user) => {
        this.user = user;
    });
    updateWaitingUser = action('updateWaitingUser', (user) => {
        this.waitingUser = user;
    });
    verifyUser = async (user) => {
        let reqProps = {
            method: 'POST',
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify({
                name: user.name,
                email: user.email,
            })
        };
        try {
            let res = await fetch(SERVER_URL + "/verify_user", reqProps);
            if (res.status === 200) {
                let json = await res.json();
                await IdbKeyval.set('waitAuth', true);
                this.updateWaitAuth(true);
                await IdbKeyval.set('waitingUser', JSON.parse(json.member));
                this.updateWaitingUser(JSON.parse(json.member));

            } else if (res.status === 401) {
                this.updateUser(null);
                await IdbKeyval.set('waitAuth', false);
                this.updateWaitAuth(false);
                await IdbKeyval.set('waitingUser', {});
                this.updateWaitingUser({});
            } else {
                console.log("verify user unknown error");
                addErrorNoti();
            }
        } catch(err) {
            console.log("Verify Failed: No server connection");
            addErrorNoti();
        }
    }
    
}

const AppStoreInstance = new AppStore();

export default AppStoreInstance;
