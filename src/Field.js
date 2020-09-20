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
            level: 'beginner',
            searchingFace: false,
            btnPressed: false,
            rtBtnPressed: false,
            win: false,
            active: [false, false]
        }

        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleLevel = this.handleLevel.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
    }

    //creating new grid and updating it
    updateGrid(mines, height, width) {
        let level = mines === 9 ? 'beginner' : mines === 40 ? 'intermediate' : 'expert';
        let newGrid = objectGrid(grid(mines, height, width));
        this.setState(curState => ({ grid: [...newGrid], mines: mines, boom: false, level: level }));
    }

    // timer start
    startTimer = () => {
        this.interval = setInterval(() => {
            this.setState(curState => ({ time: curState.time + 1 }));
        }, 1000);
        this.setState({ timer: true });
    }
    //stop timer
    stopTimer() {
        clearInterval(this.interval);
        this.setState({ timer: false });
    }

    makeVisible(row, cell) {
        let newGrid = [...this.state.grid];
        if (!newGrid[row][cell].isRevealed && !newGrid[row][cell].isFlagged) {
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
        let level = this.props[this.state.level];
        this.updateGrid(level.mines, level.height, level.width);
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

    handleClick(e) {

        e.preventDefault();

        if (e.button === 0) {
            (!this.state.timer && !this.state.boom) && this.startTimer();
            !this.state.boom && this.makeVisible(e.target.dataset.row, e.target.dataset.cell);
            // if right btn clicked
        } else if (e.button === 2) {
            this.flagPut(e);
        }
    }
    //put flags
    flagPut(e) {
        let row = e.target.dataset.row;
        let cell = e.target.dataset.cell;
        let grid = [...this.state.grid];
        let mines = this.state.mines;
        let level = this.state.level;

        // minusing mines from the counter
        if (!grid[row][cell].isFlagged && !grid[row][cell].isRevealed) {
            if (mines > 0) {
                grid[row][cell].isFlagged = true;
                mines--;
            }

            // adding mines to the counter
        } else if (grid[row][cell].isFlagged && !grid[row][cell].isRevealed) {
            if (mines < this.props[level].mines) {
                grid[row][cell].isFlagged = false;
                mines++;
            }
        }

        this.setState(curState => ({ grid: [...grid], mines: mines }));
    }

    //show searching face 
    onMouseDown(e) {
        e.preventDefault();


        // keep track if the button is pressed or both
        if (e.button === 0) {
            this.setState(curState => ({ active: [true, curState.active[1]] }));
        } else if (e.button === 2) {
            this.setState(curState => ({ active: [curState.active[0], true] }));
        }


        let row = e.target.dataset.row;
        let cell = e.target.dataset.cell;
        let grid = [...this.state.grid];

        if (e.button === 0) {

            !this.state.boom && this.setState(curState => ({ searchingFace: true, btnPressed: true }));

            if (!grid[row][cell].isFlagged && !grid[row][cell].isRevealed) {
                grid[row][cell].isPressed = true;
                this.setState(curState => ({ grid: [...grid] }));
            }

        } else if (e.button === 1) {

            // show surrounding cells pressed if middel btn pressed
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let y = +row + i;
                    let x = +cell + j;
                    if (y > -1 && y <= grid.length - 1 && x > -1 && x <= grid[y].length - 1) {
                        let neighbor = grid[y][x];
                        if (!neighbor.isRevealed && !neighbor.isFlagged) {
                            neighbor.isPressed = true;
                        }
                    }
                }
            }
            this.setState(curState => ({ grid: [...grid], rtBtnPressed: true }));
        }

    }

    onMouseLeave(e) {
        // pressed button
        let row = e.target.dataset.row;
        let cell = e.target.dataset.cell;
        let grid = [...this.state.grid];

        // cover back one cell
        if (grid[row][cell].isPressed) {
            grid[row][cell].isPressed = false;
        }

        // cover back all cells around
        if (this.state.rtBtnPressed) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let y = +row + i;
                    let x = +cell + j;
                    if (y > -1 && y <= grid.length - 1 && x > -1 && x <= grid[y].length - 1) {
                        let neighbor = grid[y][x];
                        if (!neighbor.isRevealed && !neighbor.isFlagged) {
                            neighbor.isPressed = false;
                        }
                    }
                }
            }
        }


        this.setState(curState => ({ grid: [...grid] }));
    }

    onMouseEnter(e) {
        // pressed button
        let row = e.target.dataset.row;
        let cell = e.target.dataset.cell;
        let grid = [...this.state.grid];



        // press surrounding buttons
        if (this.state.btnPressed && !grid[row][cell].isFlagged) {
            grid[row][cell].isPressed = true;
        }
        if (this.state.rtBtnPressed) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let y = +row + i;
                    let x = +cell + j;
                    if (y > -1 && y <= grid.length - 1 && x > -1 && x <= grid[y].length - 1) {
                        let neighbor = grid[y][x];
                        if (!neighbor.isRevealed && !neighbor.isFlagged) {
                            neighbor.isPressed = true;
                        }
                    }
                }
            }
            this.setState(curState => ({ grid: [...grid] }));
        }
    }

    //hide searching face 
    onMouseUp(e) {

        // keep track if the button is pressed or both
        if (e.button === 0) {
            this.setState(curState => ({ active: [false, curState.active[1]] }));
        } else if (e.button === 2) {
            this.setState(curState => ({ active: [curState.active[0], false] }));
        }


        let row = e.target.dataset.row;
        let cell = e.target.dataset.cell;
        let grid = [...this.state.grid];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let y = +row + i;
                let x = +cell + j;
                if (y > -1 && y <= grid.length - 1 && x > -1 && x <= grid[y].length - 1) {
                    let neighbor = grid[y][x];
                    if (!neighbor.isRevealed && !neighbor.isFlagged) {
                        neighbor.isPressed = false;
                    }
                }
            }
        }

        this.setState({ grid: [...grid], searchingFace: false, btnPressed: false, rtBtnPressed: false });

    }


    render() {
        return (
            <div className="Field">
                <h1>Minesweeper</h1>
                <Settings handleClick={this.handleLevel} />
                <div className="Field-grid">
                    <div className="Field-menu">
                        <div className="Menu-mines">{String(this.state.mines).padStart(3, '0')}</div>
                        <button className={`Menu-face ${this.state.boom && 'dead'} ${this.state.searchingFace && 'search'}`} onClick={this.handleClickMenu} />
                        <div className="Menu-timer">{String(this.state.time).padStart(3, '0')}</div>
                    </div>
                    {this.state.grid.map((el, idx) =>
                        <div

                            key={`row${idx}`} className={'Field-row'}>{el.map((e, i) =>
                                <Cell
                                    flagPut={this.flagPut}
                                    handleClick={this.handleClick}
                                    //show searching face 
                                    onMouseDown={this.onMouseDown}
                                    onMouseUp={this.onMouseUp}
                                    onMouseLeave={this.onMouseLeave}
                                    onMouseEnter={this.onMouseEnter}
                                    //
                                    key={`cell${i}`}
                                    dataRow={idx}
                                    dataCell={i}
                                    isRevealed={e.isRevealed}
                                    isFlagged={e.isFlagged}
                                    isPressed={e.isPressed}
                                    isBomb={e.isBomb}
                                    isBoom={e.isBoom}
                                    container={e.item}

                                />)}
                        </div>)}
                </div>
                <p>{this.state.win && 'won!'}</p>
            </div>
        );
    }
}

export default Field;