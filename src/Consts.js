import React from 'react';
import {Icon} from 'antd';

const STATUS= {
    OOO: "OOO",
    WFH: "WFH",
    SICK: "SICK",
    NO_STATUS: "NO_STATUS"
};
const opacityTransitions = {
    WebkitTransition: "opacity 1.5s linear",
    MozTransition: "opacity 1.5s linear",
    transition: "opacity 1.5s linear"
}
const COLOR_MAP = {
    OOO: "linear-gradient(350deg, rgba(245, 173, 97, 1) 0%, rgba(245, 173, 97, 1) 0%, rgba(228, 109, 111, 1) 51%, rgba(193, 34, 92, 1) 100%, rgba(193, 34, 92, 1) 100%)",
    WFH: "linear-gradient(100deg, rgba(165, 78, 138, 1) 0%, rgba(165, 78, 138, 1) 0%, rgba(128, 78, 147, 1) 53%, rgba(96, 73, 145, 1) 100%, rgba(96, 73, 145, 1) 100%)",
    SICK: "linear-gradient(100deg, rgba(53, 97, 134, 1) 0%, rgba(53, 97, 134, 1) 0%, rgba(65, 127, 148, 1) 51%, rgba(106, 191, 188, 1) 100%, rgba(106, 191, 188, 1) 100%)",
    NO_STATUS: "linear-gradient(black, black)"
};
let backgroundStyles = {
    OOO: {zIndex: -1, opacity: 0, background: "linear-gradient(350deg, rgba(245, 173, 97, 1) 0%, rgba(245, 173, 97, 1) 0%, rgba(228, 109, 111, 1) 51%, rgba(193, 34, 92, 1) 100%, rgba(193, 34, 92, 1) 100%)",  ...opacityTransitions},
    WFH: {zIndex: -1, opacity: 0, background: "linear-gradient(100deg, rgba(165, 78, 138, 1) 0%, rgba(165, 78, 138, 1) 0%, rgba(128, 78, 147, 1) 53%, rgba(96, 73, 145, 1) 100%, rgba(96, 73, 145, 1) 100%)", ...opacityTransitions},
    SICK: {zIndex: -1, opacity: 0, background: "linear-gradient(100deg, rgba(53, 97, 134, 1) 0%, rgba(53, 97, 134, 1) 0%, rgba(65, 127, 148, 1) 51%, rgba(106, 191, 188, 1) 100%, rgba(106, 191, 188, 1) 100%)", ...opacityTransitions},
    NO_STATUS: {opacity: 0,...opacityTransitions}
};
function changeScreen(newStatus) {
    if (newStatus !== STATUS.NO_STATUS) {
        backgroundStyles[newStatus] = {
            opacity: 1,
            background: backgroundStyles[newStatus].background, ...opacityTransitions
        };
    }
}
const CAPTION_MAP = {
    OOO: <p className="caption">Hope you'll get back before<br/> we'll miss you</p>,
    WFH: <p className="caption">Working Hard or hardly working?</p>,
    SICK: <p className="caption">Hope you'll feel better soon!</p>,
    NO_STATUS: <p className="caption">You have no Status</p>,
};
const IMAGE_MAP = (title, cn) => {
    let mp = {
        OOO: <Icon className={cn} type="rocket" />,
        WFH: <Icon className={cn} type="home" />,
        SICK: <Icon className={cn} type="medicine-box" />,
        NO_STATUS: "",
    };
    return mp[title];

};
// const SERVER_URL = "https://flex-server.herokuapp.com";
const SERVER_URL = "http://localhost:3141";
export {STATUS, COLOR_MAP, CAPTION_MAP, IMAGE_MAP, changeScreen, backgroundStyles, SERVER_URL}

