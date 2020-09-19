import React, { Component } from 'react';
import './Cell.css';

class Cell extends Component {
    static defaultProps = {
        colors: {
            '1': 'one',
            '2': 'two',
            '3': 'three',
            '4': 'four',
            '5': 'five',
            '6': 'six',
            '7': 'seven',
            '8': 'eight',
        }
    }
    render() {
        return (
            <div
                data-row={this.props.dataRow}
                data-cell={this.props.dataCell}
                onClick={this.props.handleClick}
                onContextMenu={this.props.handleClick}
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
                onMouseLeave={this.props.onMouseLeave}
                onMouseEnter={this.props.onMouseEnter}
                className={`Cell ${this.props.colors[this.props.container]} 
                                 ${this.props.isRevealed && 'uncover'} 
                                 ${this.props.isPressed && 'uncover'}
                                 ${this.props.isBoom && 'boom'}
                                 ${this.props.isFlagged && 'flagged'}`
                }
            >
                <span
                    data-row={this.props.dataRow}
                    data-cell={this.props.dataCell}
                    className={`${!this.props.isRevealed && 'cover'} `}
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