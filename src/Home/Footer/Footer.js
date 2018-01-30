import React, { Component } from 'react';
import './footer.css'

export default class Footer extends Component {
    state = {
        clicked: false
    }
    spanStyle = {height: "100%", zIndex: "1",opacity: "0.4", width: "100%"};
    componentWillReceiveProps() {
        this.setState({
            clicked: false
        })
    }

    render() {
        return (
            <div className="footer">
                <div className="next-button bottom-button" onClick={ () => {this.setState({clicked: true}); this.props.nextFunc()}} >
                    {this.props.text}
                    {this.props.img ? <img src={this.props.img} className="footer-img" alt="everyone"/> : ""}
                    <span style={this.state.clicked ? this.spanStyle :{}}/>
                </div>

            </div>
        );
    }
}

