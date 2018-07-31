
const STATUS= {
    OOO: "OOO",
    WF: "WF",
    SICK: "SICK",
    NO_STATUS: "NO_STATUS",
    FREE_STYLE: "Free Style",
    VACATION: "Vacation",
    SCHOOL: "School",
    HOME:"Home",
    JER: "JER",
    IDC: "IDC",
    PTK: "PTK",
    BT: "BT",
    ARRIVING: "Arriving"
};

const COLOR_MAP = {
    OOO: "linear-gradient(350deg, rgba(245, 173, 97, 1) 0%, rgba(245, 173, 97, 1) 0%, rgba(228, 109, 111, 1) 51%, rgba(193, 34, 92, 1) 100%, rgba(193, 34, 92, 1) 100%)",
    WF: "linear-gradient(100deg, rgba(165, 78, 138, 1) 0%, rgba(165, 78, 138, 1) 0%, rgba(128, 78, 147, 1) 53%, rgba(96, 73, 145, 1) 100%, rgba(96, 73, 145, 1) 100%)",
    Arriving: "linear-gradient(100deg, rgba(53, 97, 134, 1) 0%, rgba(53, 97, 134, 1) 0%, rgba(65, 127, 148, 1) 51%, rgba(106, 191, 188, 1) 100%, rgba(106, 191, 188, 1) 100%)",
    NO_STATUS: "linear-gradient(black, black)",
};

const SUB_STATUS = {
    OOO: [{name: STATUS.FREE_STYLE, emoji: "🤘"},
        {emoji: "✈", name: STATUS.VACATION},
        {emoji: "📝", name: STATUS.SCHOOL},
        {emoji: "🤒", name: STATUS.SICK}
        ]
};
const SLIDER_SETTINGS = {
    centerMode: true,
    centerPadding: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 400,
    variableWidth: false,
  };

// const SITE_URL = "https://flex-server.herokuapp.com/";

export {STATUS, COLOR_MAP, SUB_STATUS, SLIDER_SETTINGS}

