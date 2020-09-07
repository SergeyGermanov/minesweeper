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
            <div
                data-row={this.props.dataRow}
                data-cell={this.props.dataCell}
                onClick={this.props.handleClick}
                className={`Cell ${this.props.colors[this.props.container]} 
                                 ${this.props.isRevealed && 'uncover'} 
                                 ${this.props.isBoom && 'boom'}`}
            >
                <span
                    data-row={this.props.dataRow}
                    data-cell={this.props.dataCell}
                    className={`${!this.props.isRevealed && 'cover'}`}
                >
                    {this.props.container === '✳' ?
                        <img
                            data-row={this.props.dataRow}
                            data-cell={this.props.dataCell}
                            src='mine-ico.png'
                        />
                        : this.props.container !== 0 && this.props.container}
                </span>
            </div>
        );
    }
}

export default Cell;