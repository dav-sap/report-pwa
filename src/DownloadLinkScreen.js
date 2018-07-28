import React, { Component } from 'react';
import './App.css';


export default class DownloadLinkScreen extends Component {


    render() {
        return (
            <div className="download-link-screen">
                <a href="/base.apk" download="where_my_peers_v1.2.apk">
                    <img className="background-img" src="/images/icons/logo_with_text.png"/>
                </a>
                <div className="app-text">The App has been moved</div>
                <div>Click on the icon above or</div>
                <div className="download-link">
                    <a href="/base.apk" download="where_my_peers_v1.2.apk" style={{color:"black"}}>
                        Download APK from here
                    </a>
                </div>
                <div>
                    If you are using an iOS device
                </div>
                <div>
                    or can't install apk's use this link
                </div>
                <div className="link">
                    <a href="https://flex-server.herokuapp.com">
                        https://flex-server.herokuapp.com
                    </a>
                </div>
                <div>
                    go to page settings (chrome or safari (on iOS 11.3) )
                </div>
                <div>
                    and click "Add to Home Screen"
                </div>
            </div>
        );
    }
}

