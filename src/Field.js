import React, { Component } from 'react';
import './Field.css';
import Cell from './Cell';
import { surroundBombs, grid, objectGrid, revealBombs, reveal } from './helper';

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
        let newGrid = objectGrid(surroundBombs(grid(20, 15, 15)));
        this.setState(curState => ({ grid: [...newGrid], boom: false }));
    }

    makeVisible(row, cell) {
        let newGrid = [...this.state.grid];
        if (!newGrid[row][cell].isRevealed) {

            // newGrid[row][cell].isRevealed = true;

            revealBombs(newGrid, newGrid[row][cell]);
            reveal(newGrid, row, cell);

            //reveale full row of the empty click 

            //////reveal one line and still cannot open full down!!!!
            // if (newGrid[row][cell].item === 0) {



            // }
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