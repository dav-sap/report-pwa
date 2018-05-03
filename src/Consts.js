import React from 'react';


const STATUS= {
    OOO: "OOO",
    WF: "WF",
    SICK: "SICK",
    NO_STATUS: "NO_STATUS"
};

const COLOR_MAP = {
    OOO: "linear-gradient(350deg, rgba(245, 173, 97, 1) 0%, rgba(245, 173, 97, 1) 0%, rgba(228, 109, 111, 1) 51%, rgba(193, 34, 92, 1) 100%, rgba(193, 34, 92, 1) 100%)",
    WF: "linear-gradient(100deg, rgba(165, 78, 138, 1) 0%, rgba(165, 78, 138, 1) 0%, rgba(128, 78, 147, 1) 53%, rgba(96, 73, 145, 1) 100%, rgba(96, 73, 145, 1) 100%)",
    SICK: "linear-gradient(100deg, rgba(53, 97, 134, 1) 0%, rgba(53, 97, 134, 1) 0%, rgba(65, 127, 148, 1) 51%, rgba(106, 191, 188, 1) 100%, rgba(106, 191, 188, 1) 100%)",
    NO_STATUS: "linear-gradient(black, black)"
};

const CAPTION_MAP = {
    OOO: <p className="caption">Hope you'll get back before<br/> we'll miss you</p>,
    WF: <p className="caption">Working Hard or hardly working?</p>,
    SICK: <p className="caption">Hope you'll feel better soon!</p>,
    NO_STATUS: <p className="caption">You have no Status</p>,
};
const SUB_STATUS = {
    OOO: [<div><span role="img" aria-label="free">🤙</span><div>Free Style</div></div>,
            <div><span role="img" aria-label="vacation">🛫</span><div>Vacation</div></div>,
            <div><span role="img" aria-label="sick">🤒</span><div>Sick</div></div>,
        <div><span role="img" aria-label="school">✏</span><div>School</div></div>],
    WF: [<div><span role="img" aria-label="free">🤙</span><div>Free Style</div></div>,
        <div><span role="img" aria-label="home">🏡</span><div>Home</div></div>,
        <div><span role="img" aria-label="jer">🕍</span><div>JER</div></div>,
        <div><span role="img" aria-label="idc">🏭</span><div>IDC</div></div>,
        <div><span role="img" aria-label="bt">🗽</span><div>BT</div></div>,
        <div><span role="img" aria-label="ptk">⛺</span><div>PTK</div></div>]
};
const SLIDER_SETTINGS = {
    centerMode: true,
    centerPadding: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 400,
    variableWidth: false,
  };
const SERVER_URL = "https://flex-server.herokuapp.com";
// const SERVER_URL = "http://localhost:3141";
export {STATUS, COLOR_MAP, CAPTION_MAP, SUB_STATUS, SERVER_URL, SLIDER_SETTINGS}

