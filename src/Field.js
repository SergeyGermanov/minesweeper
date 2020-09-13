import React, { Component } from 'react';
import './Field.css';
import Cell from './Cell';
import { grid, objectGrid, revealBombs, reveal } from './helper';

class Field extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: objectGrid(grid()),
            boom: false,
            mines: 5,
            time: 0
        }

        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    //creating new grid and updating it
    updateGrid(num, h, w) {
        console.log(num + ' upgradeGrid');
        let newGrid = objectGrid(grid(num, h, w));
        this.setState(curState => ({ grid: [...newGrid], mines: num, boom: false }));
    }

    makeVisible(row, cell) {
        let newGrid = [...this.state.grid];
        if (!newGrid[row][cell].isRevealed) {
            revealBombs(newGrid, newGrid[row][cell]);
            reveal(newGrid, row, cell);
            this.setState(curState => ({ grid: [...newGrid], boom: newGrid[row][cell].isBoom }));
        }
    }

    handleClickMenu(e) {
        console.log(this.state.mines + ' handleClick');
        //only updates the latest vetsion of state in updateGrid
        //I have to send it as an argument to the function or find the way to setState all the changes
        this.updateGrid(this.state.mines + 10);
    }

    handleClick(e) {
        !this.state.boom && this.makeVisible(e.target.dataset.row, e.target.dataset.cell);

    }

    render() {
        return (
            <div className="Field">
                <h1>Minesweeper</h1>

                <div className="Field-grid">
                    <div className="Field-menu">
                        <div className="Menu-mines">{String(this.state.mines).padStart(3, '0')}</div>
                        <div className="Menu-face" onClick={this.handleClickMenu}>
                            😊
                    {/* 😲😣⛳ */}
                        </div>
                        <div className="Menu-timer">{String(this.state.time).padStart(3, '0')}</div>
                    </div>
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