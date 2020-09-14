import React, { Component } from 'react';
import './Settings.css';

class Settings extends Component {
    render() {
        return (
            <div className="Settings">
                <button className="Setting-btn" onClick={this.props.handleClick} data-level="beginner">Beginner level</button>
                <button className="Setting-btn" onClick={this.props.handleClick} data-level="intermediate">Intermediate level</button>
                <button className="Setting-btn" onClick={this.props.handleClick} data-level="expert">Expert level</button>
            </div>
        );
    }
}

export default Settings;