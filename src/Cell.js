import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component {
    static defaultProps = {
        colors: {
            '0': 'no-color',
            '1': 'blue',
            '2': 'crimson',
            '3': 'red',
            '4': 'brown',
            '5': 'darkred',
            '6': 'purple',
            '7': 'darkblue',
            '8': 'orange',
            '✳': 'darkolivegreen'
        }
    }
    render() {
        return (
            <div className={`Cell ${this.props.colors[this.props.container]}`}>
                {this.props.container === '✳' ? <img src='mine-ico.png' /> : this.props.container !== 0 && this.props.container}
            </div>
        );
    }
}

export default Cell;