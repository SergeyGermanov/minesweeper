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
        let newGrid = objectGrid(surroundBombs(grid(70, 15, 15)));
        this.setState(curState => ({ grid: [...newGrid], boom: false }));
    }

    makeVisible(row, cell) {
        let newGrid = [...this.state.grid];
        if (!newGrid[row][cell].isRevealed) {

            newGrid[row][cell].isRevealed = true;

            if (newGrid[row][cell].isBomb) {
                newGrid[row][cell].isBoom = true
                newGrid.map(el => el.map(e => e.isBomb ? e.isRevealed = true : e));
            }

            //reveale full row of the empty click
            if (newGrid[row][cell].item === 0) {
                //arr of indexes for begining and end of empty spaces
                let idxs = [];
                //push index for the right side
                newGrid[row].map((el, i) => (el.item > 0 && !el.isBomb && i > cell) && idxs.push(i));
                //destruct/destroy the index array and create variable with the right index
                let [rightIdx] = idxs;
                console.log(rightIdx + ' right index');
                idxs.length = 0;

                //reverser array and find the left index for empty space and push it to idxs array
                newGrid[row].reverse().map((el, i, arr) => (el.item > 0 && !el.isBomb && i > arr.length - 1 - cell) && idxs.push(i));
                //reverse back to normal
                newGrid[row].reverse();
                //convert index to a normal not reversed
                let leftIdx = newGrid[row].length - 1 - (idxs[0] || newGrid[row].length - 1);
                console.log(idxs[0] + ' idxs index');
                console.log(leftIdx + ' left index');

                //update the key of isRevealed to true for the cells surrounding the clicked one
                newGrid[row].map((el, i, arr) => i >= (leftIdx || 0) && i <= (rightIdx || arr.length - 1) ? el.isRevealed = true : el);
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