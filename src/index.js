import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const color = props.value === 'X'?'#F95F58':'#5E79E0';
  return (
    <button 
      className="square" 
      onClick={props.onClick}
      style={{color: `${color}`,background:`${props.bgColor}`}}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  getWinnerSquares(squares) {
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a,b,c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a,b,c];
      }
    }
    return null;
  }

  renderSquare(i) {
    const winnerSquares = this.getWinnerSquares(this.props.squares);
    if (winnerSquares) {
      if (i === winnerSquares[0]|| i === winnerSquares[1] || i === winnerSquares[2]) {
        return (
          <Square 
            key={i} 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
            bgColor={'lightblue'}
          />
        );
      } else {
        return (
          <Square 
            key={i} 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
          />
        );
      }
    } else {
      return (
        <Square 
          key={i} 
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  } 

  render() {
    let squares = [], rows=[];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(j + i*3));
      }
      rows.push(<div key={i} className="board-row">{squares}</div>);
      squares = []
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      locations:[''],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    };
    this.initialState = this.state;
  }

  resetGame = () => {
    this.setState(this.initialState);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const locations = this.state.locations.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    let row, col;
    if (i > 5) {
      row = 3;
      col = i -5;
    } else if (i > 2) {
      row = 2;
      col = i -2;
    } else {
      row = 1;
      col = i + 1;
    }
    
    const location = '(' + col + ',' + row + ')';
    
    locations.push(location);

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      locations: locations
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  sortMoves = () => {
    this.setState({
      isAsc: !this.state.isAsc,
    })
  }

  render() {
    
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = this.state.locations.map((location, move) => {
      const desc = move ? 'Go to move #' + move + ' ' + location : 'Go to game start';
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button 
              className="move-btn" 
              onClick={() => this.jumpTo(move)}
              style={{fontWeight:'bold',backgroundColor:'#DFBBC2',color:'#183340'}} 
            >
              {desc}
            </button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button 
              className="move-btn" 
              onClick={() => this.jumpTo(move)}
            >
              {desc}
            </button>
          </li>
        );
      }
    });

    if(!this.state.isAsc) {
      moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;

    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const sortText = this.state.isAsc ? 'Sort in ascending' : 'Sort in descending';

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares} 
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <button className='sort-btn' onClick={this.sortMoves}>{sortText}</button>
          <ol>{moves}</ol> 
          <button className='reset-btn' onClick={this.resetGame}>Reset game</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
