import React, { Component } from 'react';
import './Field.css';
import Cell from './Cell';
import { surroundBombs, grid, objectGrid } from './helper';

class Field extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: objectGrid(surroundBombs()),
            boom: false
        }

        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }



    updateGrid() {
        let newGrid = objectGrid(surroundBombs(grid(40, 15, 15)));
        this.setState(curState => ({ grid: [...newGrid], boom: false }));
    }

    makeVisible(row, cell) {
        let newGrid = this.state.grid;
        if (!newGrid[row][cell].isRevealed) {

            newGrid[row][cell].isRevealed = true;

            if (newGrid[row][cell].isBomb) {
                newGrid[row][cell].isBoom = true
                newGrid.map(el => el.map(e => e.isBomb ? e.isRevealed = true : e));
            }

            if (newGrid[row][cell].item === 0) {
                //reveale full row of the empty click
                newGrid[row].map(el => !el.isBomb ? el.isRevealed = true : el);
                //reveale full column of the empty click
                newGrid.map(el => el.map((e, i) => el[i] === el[cell] && !e.isBomb ? e.isRevealed = true : e));
            }

            this.setState(curState => ({ grid: [...newGrid], boom: newGrid[row][cell].isBoom }));
        }
    }

    handleClickMenu(e) {
        this.updateGrid();
    }

    handleClick(e) {
        !this.state.boom && this.makeVisible(e.target.dataset.row, e.target.dataset.cell);
    }

    render() {
        return (
            <div className="Field">
                <h1>Minesweeper</h1>
                <div className="Field-menu">
                    <div className="Menu-mines">10</div>
                    <div className="Menu-face" onClick={this.handleClickMenu}>
                        😊
                    {/* 😲😣⛳ */}
                    </div>
                    <div className="Menu-timer">00</div>
                </div>
                <div className="Field-grid">
                    {this.state.grid.map((el, idx) =>
                        <div key={`row${idx}`} className={'Field-row'}>{el.map((e, i) =>
                            <Cell
                                handleClick={this.handleClick}
                                key={`cell${i}`}
                                dataRow={idx}
                                dataCell={i}
                                isRevealed={e.isRevealed}
                                isBomb={e.isBomb}
                                isBoom={e.isBoom}
                                container={e.item}
                            />)}
                        </div>)}
                </div>
            </div>
        );
    }
}

export default Field;