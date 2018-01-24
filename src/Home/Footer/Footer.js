import React, { Component } from 'react';
import './footer.css'

export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="next-button bottom-button" onClick={this.props.nextFunc} >
                    {this.props.text}
                </div>

            </div>
        );
    }
}

