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
    OOO: [<div><img alt="free" className="sub-status-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURUdwTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/JOtaPAPbAM+SiDvC0JIhpGSwgA1lEDbWOJtytMU8h0PYAAAAKdFJOUwArc/+TURPx1ri5HuJyAAACgElEQVRYw+1Y25aDIAysoOKFi8j//+vKHVGihX3bzZOnPZ1mkglM/Hz+49djmCdMJjQ2wowztkFQE05HcIi+BWjCSQz1OEj/Xu6UC/0wtSUkFx2qKaVO/5oboEW0VKkPCS3LfjzPtQLSCe2tQMg1jC6vqKGJ4Bl1l+L0Xj+e2QIWe/QymfphzDnp2ARNmJHxldxcYiMKn0pfnyM2iBnCWRyJBU5YqAhjZdSBclNKSHyJyMmGBHum/9z8Ld3FlsKknExQWNf625h8SOzEKfaefN4BmcTktu10ucYGiygHKoaZ/bEBiDPG+EINZ2g8HoD4asPWbu5qgei6Ms45W30vUSXQgWMTC9KYq4AOYlEaEj7+QSDmEvJDuwFDAgKt61lQCtASBKRbxvgpp/I9AgEx23oW0+LlMQGAjt4v1AqJ0zi43wNxW2pqErMU66gdiYQxcViyptg0EZHHAo6kMlAmIl0ugWsyylt/QClAkUUgnrfeQJUVWQQ6mLFT6x8UGQ7/2/HgSevjDVC8jjZ11zOWtf5BkchdYepeja5dgSKgyDlch6qsIurKBSkyeN+s6FHXuSI72EzlQDxH0ljiwY6OaE79VDhEckWaSxI9e9f9RpInLNiPRM+JRSYB13r6zo8kLvhqHlzrFQ+39qPPRgVXZFovsRT2anvh/AdStEY8OqfuzTYVLV9Ocfd71vCVP7cUTybp2URcJTXduT9zEJEvN8jE1cYBVLhmfRgTu65Sx1axinae4kaT8SBV67Gj6JFUZUrxiJEJuepNdE5GkBfP6zc5TRGJwo791dK/N1PzSIJS0foCYUg2HdL0dmT4lfcQ6QFDGnHMJBMy9a1vff5m/ADswEqLffekZAAAAABJRU5ErkJggg=="/><div>Free Style</div></div>,
            <div><span role="img" className="sub-status-icon" aria-label="vacation">✈</span><div>Vacation</div></div>,
            <div><span role="img" className="sub-status-icon" aria-label="sick">🤒</span><div>Sick</div></div>,
        <div><span role="img" aria-label="school">📝</span><div>School</div></div>],
    WF: [<div><img alt="free" className="sub-status-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA8UExURUdwTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/JOtaPAPbAM+SiDvC0JIhpGSwgA1lEDbWOJtytMU8h0PYAAAAKdFJOUwArc/+TURPx1ri5HuJyAAACgElEQVRYw+1Y25aDIAysoOKFi8j//+vKHVGihX3bzZOnPZ1mkglM/Hz+49djmCdMJjQ2wowztkFQE05HcIi+BWjCSQz1OEj/Xu6UC/0wtSUkFx2qKaVO/5oboEW0VKkPCS3LfjzPtQLSCe2tQMg1jC6vqKGJ4Bl1l+L0Xj+e2QIWe/QymfphzDnp2ARNmJHxldxcYiMKn0pfnyM2iBnCWRyJBU5YqAhjZdSBclNKSHyJyMmGBHum/9z8Ld3FlsKknExQWNf625h8SOzEKfaefN4BmcTktu10ucYGiygHKoaZ/bEBiDPG+EINZ2g8HoD4asPWbu5qgei6Ms45W30vUSXQgWMTC9KYq4AOYlEaEj7+QSDmEvJDuwFDAgKt61lQCtASBKRbxvgpp/I9AgEx23oW0+LlMQGAjt4v1AqJ0zi43wNxW2pqErMU66gdiYQxcViyptg0EZHHAo6kMlAmIl0ugWsyylt/QClAkUUgnrfeQJUVWQQ6mLFT6x8UGQ7/2/HgSevjDVC8jjZ11zOWtf5BkchdYepeja5dgSKgyDlch6qsIurKBSkyeN+s6FHXuSI72EzlQDxH0ljiwY6OaE79VDhEckWaSxI9e9f9RpInLNiPRM+JRSYB13r6zo8kLvhqHlzrFQ+39qPPRgVXZFovsRT2anvh/AdStEY8OqfuzTYVLV9Ocfd71vCVP7cUTybp2URcJTXduT9zEJEvN8jE1cYBVLhmfRgTu65Sx1axinae4kaT8SBV67Gj6JFUZUrxiJEJuepNdE5GkBfP6zc5TRGJwo791dK/N1PzSIJS0foCYUg2HdL0dmT4lfcQ6QFDGnHMJBMy9a1vff5m/ADswEqLffekZAAAAABJRU5ErkJggg=="/><div>Free Style</div></div>,
        <div><span role="img" className="sub-status-icon" aria-label="home">🏡</span><div>Home</div></div>,
        <div><img alt="jer" className="sub-status-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTM3Nzebm5vLy8gAAAAAAAAAAAAAAAAAAAAAAAAAAALEFE/Ssu3d3dqmpqSgoKIqKiloBBsx7gv+6ALuYOExMTDQ0NPPN1fS0A/S1AtbNIasAAAAKdFJOUwD///8jnVLxPcwLBNQnAAABqUlEQVRYw+3W23aCMBAFUJPAAkRitIj1/3+0mSEJkwtK0PLQch5c1Z5sJwFtD4c9uanLpqqasvZeq181ohTN0aQpppVVVT9vxONURxe3GF70nkSNeB7S0r2CLDWLko04OPVNci5vODsdYZRSjcTG4HdKYBT8XNOtgJRqJFLCu+nGMOguvGNpnMvFSInG3M6kUGcdJSRMbpy2NZLXYLN7g1VcDFAbBMelxrHSMWxUSQhqQpwxQtizQcdIcWM5BM71SqSVEDqcE2kxZEMdKvmNhZBziLQGIs4krYA8x0n5kHWk6jolnZQNWUczEGWlbIg4fU+kFRDuC6b5fsCj2V0+hOesuv4L0+NIWsqGxusF84ADM43XLhviFnp4EF8JhVtbDDGXcRke9sMdts7UyIL8y58BhVvzbsh3zoh+RN6FgmwDTX+Fc6Exm0NMfgRiUocth1gQd/VNeHRDJm7LeYhJF5YFhVuTJOHWNoPup9OdQK0JgUzjBaRb2JuHbOMFdMI8g2xjh3Zoh/4WRL/YRJDV35AfglgiW0Ljv0FTrZtJ2Pg96J38B2jP0/wAnLpiw/pgricAAAAASUVORK5CYII="/><div>JER</div></div>,
        <div><span role="img" className="sub-status-icon" aria-label="idc">🏭</span><div>IDC</div></div>,
        <div><span role="img" className="sub-status-icon" aria-label="bt">🗽</span><div>BT</div></div>,
        <div><span role="img" className="sub-status-icon" aria-label="ptk">⛺</span><div>PTK</div></div>]
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

