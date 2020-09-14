import React, { Component } from 'react';
import './Field.css';
import Cell from './Cell';
import Settings from './Settings';
import { grid, objectGrid, revealBombs, reveal } from './helper';

class Field extends Component {
    static defaultProps = {
        beginner: { mines: 9, width: 9, height: 9 },
        intermediate: { mines: 40, width: 16, height: 16 },
        expert: { mines: 99, width: 30, height: 16 }
    }
    constructor(props) {
        super(props);
        this.state = {
            grid: objectGrid(grid()),
            boom: false,
            mines: 9,
            time: 0,
            timer: false,
            level: 'beginner'
        }

        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleLevel = this.handleLevel.bind(this);
    }

    //creating new grid and updating it
    updateGrid(mines, height, width) {
        console.log(mines + ' upgradeGrid');
        let level = mines === 9 ? 'beginner' : mines === 40 ? 'intermediate' : 'expert';
        let newGrid = objectGrid(grid(mines, height, width));
        this.setState(curState => ({ grid: [...newGrid], mines: mines, boom: false, level: level }));
    }

    // 
    startTimer = () => {
        this.interval = setInterval(() => {
            this.setState(curState => ({ time: curState.time + 1 }));
        }, 1000);
        this.setState({ timer: true });
    }

    stopTimer() {
        clearInterval(this.interval);
        this.setState({ timer: false });
    }

    makeVisible(row, cell) {
        let newGrid = [...this.state.grid];
        if (!newGrid[row][cell].isRevealed) {
            if (newGrid[row][cell].isBomb) {
                this.stopTimer();
                revealBombs(newGrid, newGrid[row][cell]);
            }
            reveal(newGrid, row, cell);
            this.setState(curState => ({ grid: [...newGrid], boom: newGrid[row][cell].isBoom }));
        }
    }

    handleClickMenu(e) {
        this.stopTimer();
        this.setState({ time: 0 });
        console.log(this.props['expert']);
        let level = this.props[this.state.level];
        this.updateGrid(level.mines, level.height, level.width);
    }

    handleClick(e) {
        !this.state.timer && this.startTimer();
        !this.state.boom && this.makeVisible(e.target.dataset.row, e.target.dataset.cell);
    }

    levelChange(mines, height, width) {
        this.stopTimer();
        this.setState({ time: 0 });
        this.updateGrid(mines, height, width);
    }

    handleLevel(e) {
        let obj = this.props[e.target.dataset.level];
        this.levelChange(obj.mines, obj.height, obj.width);
    }

    render() {
        return (
            <div className="Field">
                <h1>Minesweeper</h1>
                <Settings handleClick={this.handleLevel} />
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