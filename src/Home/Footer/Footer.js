import React, { Component } from 'react';
import './footer.css'

export default class Footer extends Component {
    
    render() {
        return (
            <div className="footer">
                <div className={this.props.className + " next-button bottom-button"} onClick={this.props.nextFunc} >
                    {this.props.text}
                    {this.props.img ? <img src={this.props.img} className="footer-img" alt="everyone"/> : ""}
                </div>

            </div>
        );
    }
}

