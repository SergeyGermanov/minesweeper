import React, { Component } from 'react';
import './Field.css';
import Cell from './Cell';
import { surroundBombs, grid } from './helper';

class Field extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: surroundBombs()
        }

        this.handleClick = this.handleClick.bind(this);
    }



    updateGrid() {
        let newGrid = surroundBombs(grid(40, 15, 15));
        console.log(newGrid);
        this.setState(curState => ({ grid: [...newGrid] }));
    }

    handleClick() {
        this.updateGrid();
    }

    render() {
        return (
            <div className="Field">
                <h1>Minesweeper</h1>
                <div className="Field-menu">
                    <div className="Menu-mines">10</div>
                    <div className="Menu-face" onClick={this.handleClick}>
                        😊
                    {/* 😲😣⛳ */}
                    </div>
                    <div className="Menu-timer">00</div>
                </div>
                <div className="Field-grid">
                    {this.state.grid.map((el, idx) =>
                        <div key={`row${idx}`} className={'Field-row'}>{el.map((e, i) =>
                            <Cell
                                key={`cell${i}`}
                                isRevealed={false}
                                isBomb={e === '✳'}
                                container={e}
                            />)}
                        </div>)}
                </div>
            </div>
        );
    }
}

export default Field;