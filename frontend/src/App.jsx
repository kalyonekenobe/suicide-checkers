import { useState, useEffect, useRef, forwardRef } from "react";
import { calculatePossibleMoves } from "./app.utils";
import { smartMove, parseBoard, canMove } from "./game.config";

const CrownIcon = ({ className = "", style = {} }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version={1.0}
      viewBox="0 0 1280.000000 815.000000"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={style}
    >
      <g
        transform="translate(0.000000,815.000000) scale(0.100000,-0.100000)"
        fill="currentColor"
        stroke="none"
      >
        <path d="M6224 8131 c-137 -37 -202 -83 -331 -229 -139 -159 -190 -310 -179 -527 9 -184 62 -316 185 -461 38 -44 91 -97 118 -117 55 -40 169 -97 195 -97 9 0 19 -4 22 -9 10 -16 -743 -2610 -779 -2686 -48 -100 -88 -150 -141 -176 -41 -19 -50 -20 -86 -10 -55 17 -124 88 -185 191 -27 47 -343 465 -702 929 l-652 845 46 39 c209 179 315 387 315 617 0 172 -47 303 -159 442 -132 164 -238 240 -389 279 -133 34 -263 18 -402 -49 -58 -28 -93 -55 -159 -122 -136 -139 -209 -256 -242 -390 -17 -71 -17 -249 0 -320 19 -77 81 -207 132 -276 116 -158 250 -254 404 -291 39 -9 71 -17 72 -18 3 -2 -194 -1964 -203 -2020 -12 -74 -54 -192 -84 -233 -75 -104 -178 -97 -335 23 -38 29 -385 259 -770 510 -385 251 -706 463 -713 470 -11 10 -8 21 22 63 142 197 175 498 79 726 -83 199 -274 374 -468 432 -73 21 -217 24 -295 5 -30 -7 -93 -31 -140 -53 -71 -35 -100 -56 -180 -137 -74 -74 -105 -115 -137 -176 -68 -131 -78 -178 -78 -355 0 -135 3 -165 24 -230 98 -314 354 -513 661 -513 109 -1 171 15 268 68 35 20 65 35 67 33 5 -7 275 -516 383 -723 327 -629 481 -1071 562 -1610 6 -38 13 -82 16 -98 l6 -27 4398 0 4397 0 7 52 c12 95 76 400 112 535 77 294 201 611 374 962 103 209 458 890 471 905 4 5 21 -1 37 -13 80 -56 244 -98 346 -87 174 20 302 81 426 206 47 47 100 111 119 142 197 336 129 725 -172 978 -77 65 -183 121 -267 141 -71 17 -200 17 -270 0 -127 -31 -278 -131 -375 -249 -124 -150 -172 -298 -162 -504 7 -163 52 -301 134 -416 25 -36 30 -49 20 -58 -6 -6 -330 -218 -718 -471 -388 -254 -737 -485 -775 -514 -89 -67 -137 -89 -200 -89 -94 0 -157 69 -194 214 -14 57 -48 371 -115 1089 -52 555 -95 1013 -95 1018 0 5 7 9 14 9 38 0 179 54 233 89 118 76 246 231 299 363 69 168 72 395 7 558 -39 98 -87 165 -193 271 -107 107 -188 155 -315 185 -135 31 -299 2 -432 -78 -70 -42 -202 -174 -258 -258 -147 -223 -146 -563 4 -792 49 -76 137 -171 206 -225 l40 -30 -31 -39 c-288 -365 -1292 -1681 -1329 -1743 -56 -93 -138 -175 -185 -184 -77 -16 -158 60 -216 203 -12 30 -76 240 -142 465 -66 226 -238 810 -382 1300 -143 489 -258 895 -256 902 3 7 12 13 20 13 7 0 51 18 96 41 100 50 237 180 294 279 116 199 139 467 59 670 -74 188 -263 377 -432 431 -96 31 -271 36 -367 10z" />
        <path d="M1990 660 l0 -660 4395 0 4395 0 2 660 3 660 -4397 0 -4398 0 0 -660z" />
      </g>
    </svg>
  );
};

const Cell = ({ className = "", underAttack = false, children, onClick }) => {
  return (
    <div
      className={`inline-flex w-[80px] h-[80px] items-center justify-center box-content ${className} ${
        underAttack
          ? "after:content-['']; after:w-[16px] after:h-[16px] after:rounded-full after:bg-neutral-600"
          : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Checker = forwardRef(
  ({ className = "", color, type = "man", x, y, onClick, isSelected }, ref) => {
    return (
      <div
        className={`inline-flex justify-center items-center rounded-full w-[75%] h-[75%] shadow-[0_0_10px_-2px_black] cursor-pointer hover:shadow-[0_0_10px_0px_black] transition-[0.3s_ease] ${
          color === "black" ? "bg-black" : "bg-white"
        } ${isSelected ? "border-4 border-red-600" : ""} ${className}`}
        coordinate-x={x}
        coordinate-y={y}
        onClick={onClick}
        ref={ref}
      >
        {type === "king" && (
          <CrownIcon
            style={{
              width: "2.5em",
              color: color === "white" ? "black" : "white",
            }}
          />
        )}
      </div>
    );
  }
);

const Board = ({ state, setState, onClick }) => {
  const refs = useRef({});
  const [attackingCheckers, setAttackingCheckers] = useState([]);
  let coordinatesX = Array.from({ length: 8 }, (_, i) => i + 1).map(
    (i) => i - 1
  );
  let coordinatesY = structuredClone(coordinatesX);

  const checkCanMove = (callback) => {
    fetch(
      `http://localhost:8080/?predicate=${btoa(
        canMove(state.move, state.board)
      )}`
    )
      .then(async (response) => {
        if (response.status === 200) return await response.text();
        else throw new Error("Game over");
      })
      .then(() => {
        callback();
      })
      .catch(() => {
        setState({
          ...state,
          winner:
            state.board.black.length > state.board.white.length
              ? "white"
              : "black",
          gameIsStarted: false,
        });
      });
  };

  const doSmartMove = ({ updateBoardAndMove }) => {
    fetch(
      `http://localhost:8080/?predicate=${btoa(
        smartMove(state.move, state.board)
      )}`
    )
      .then(async (response) => {
        if (response.status === 200) return await response.text();
      })
      .then((data) => {
        const board = parseBoard(data);

        if (board) {
          new Promise((resolve) => setTimeout(() => resolve(), 500)).then(
            () => {
              updateBoardAndMove(
                board,
                state.move === "white" ? "black" : "white"
              );
            }
          );
        }
      });
  };

  if (state.side === "white") coordinatesY = coordinatesY.reverse();

  useEffect(() => {
    if (state.gameIsStarted) {
      checkCanMove(() => {
        if (
          state.mode !== "PlayerVSPlayer" &&
          (state.move !== state.side || state.mode === "ComputerVSComputer")
        ) {
          doSmartMove({
            updateBoardAndMove: (board, move) =>
              setState((prevState) => ({ ...prevState, move, board })),
          });
        }
      });
    }
  }, [state.move, state.side, state.mode, state.gameIsStarted]);

  useEffect(() => {
    setAttackingCheckers(
      [
        ...state.board.white.map((checker) => ({
          ...checker,
          nextMove: calculatePossibleMoves(checker, state.board),
          color: "white",
        })),
        ...state.board.black.map((checker) => ({
          ...checker,
          nextMove: calculatePossibleMoves(checker, state.board),
          color: "black",
        })),
      ].filter(
        (checker) => checker.color === state.move && checker.nextMove.attacking
      )
    );
  }, [state.board]);

  return (
    <div
      className="bg-amber-950 shadow-[0_0_20px_5px_silver] p-10 rounded-xl"
      onClick={onClick}
    >
      <div className="bg-white grid grid-cols-8 grid-rows-8 box-content rounded-xl">
        {coordinatesY.map((i) =>
          coordinatesX.map((j) => {
            const blackChecker = state.board.black.find(
              (checker) => checker.x === j && checker.y === i
            );
            const whiteChecker = state.board.white.find(
              (checker) => checker.x === j && checker.y === i
            );
            const classes =
              state.side === "white"
                ? `${(i + j) % 2 === 0 ? "bg-amber-700 " : "bg-neutral-50 "}${
                    i === 0 && j === 0 ? "rounded-bl-xl " : ""
                  }${i === 7 && j === 0 ? "rounded-tl-xl " : ""}${
                    i === 0 && j === 7 ? "rounded-br-xl " : ""
                  }${i === 7 && j === 7 ? "rounded-tr-xl " : ""}`
                : `${(i + j) % 2 === 0 ? "bg-amber-700 " : "bg-neutral-50 "}${
                    i === 0 && j === 0 ? "rounded-tl-xl " : ""
                  }${i === 7 && j === 0 ? "rounded-bl-xl " : ""}${
                    i === 0 && j === 7 ? "rounded-tr-xl " : ""
                  }${i === 7 && j === 7 ? "rounded-br-xl " : ""}`;

            return (
              <Cell
                key={`${i}-${j}`}
                className={classes}
                underAttack={
                  state.selectedChecker?.nextMove?.possibleMoves.find(
                    (move) => move.x === j && move.y === i
                  ) !== undefined
                }
                onClick={(event) => {
                  if (
                    state.gameIsStarted &&
                    state.selectedChecker &&
                    state.selectedChecker?.nextMove?.possibleMoves.find(
                      (move) => move.x === j && move.y === i
                    )
                  ) {
                    event.stopPropagation();

                    refs.current[i * 8 + j] =
                      refs.current[
                        state.selectedChecker.y * 8 + state.selectedChecker.y
                      ];
                    delete refs.current[
                      state.selectedChecker.y * 8 + state.selectedChecker.y
                    ];

                    let beatedCheckers = [];

                    const directionX = j < state.selectedChecker.x ? 1 : -1;
                    const directionY = i < state.selectedChecker.y ? 1 : -1;

                    for (
                      let x = j, y = i;
                      state.selectedChecker.x !== x &&
                      state.selectedChecker.y !== y;
                      x += directionX, y += directionY
                    ) {
                      if (
                        x !== j &&
                        x !== state.selectedChecker.x &&
                        y !== i &&
                        y !== state.selectedChecker.y
                      ) {
                        if (state.selectedChecker.color === "white") {
                          const checker = state.board.black.find(
                            (item) => item.x === x && item.y === y
                          );
                          if (checker) beatedCheckers.push(checker);
                        } else if (state.selectedChecker.color === "black") {
                          const checker = state.board.white.find(
                            (item) => item.x === x && item.y === y
                          );
                          if (checker) beatedCheckers.push(checker);
                        }
                      }
                    }

                    const isKing =
                      (i === 0 && state.selectedChecker.color === "black") ||
                      (i === 7 && state.selectedChecker.color === "white") ||
                      state.selectedChecker.type === "king";

                    setState({
                      ...state,
                      board: {
                        ...state.board,
                        white:
                          state.selectedChecker.color === "white"
                            ? state.board.white.map((item) =>
                                item.x === state.selectedChecker.x &&
                                item.y === state.selectedChecker.y
                                  ? {
                                      ...item,
                                      x: j,
                                      y: i,
                                      type: isKing ? "king" : "man",
                                    }
                                  : item
                              )
                            : state.board.white,
                        black:
                          state.selectedChecker.color === "black"
                            ? state.board.black.map((item) =>
                                item.x === state.selectedChecker.x &&
                                item.y === state.selectedChecker.y
                                  ? {
                                      ...item,
                                      x: j,
                                      y: i,
                                      type: isKing ? "king" : "man",
                                    }
                                  : item
                              )
                            : state.board.black,
                      },
                      selectedChecker: !state.selectedChecker.nextMove.attacking
                        ? null
                        : {
                            ...state.selectedChecker,
                            beatedCheckers,
                            type: isKing ? "king" : "man",
                            x: j,
                            y: i,
                          },
                    });

                    setState((prevState) => ({
                      ...prevState,
                      board: {
                        ...prevState.board,
                        white:
                          prevState.selectedChecker?.color === "black" &&
                          beatedCheckers.length > 0
                            ? prevState.board.white.filter(
                                (item) =>
                                  !beatedCheckers.find(
                                    (checker) =>
                                      checker.x === item.x &&
                                      checker.y === item.y
                                  )
                              )
                            : prevState.board.white,
                        black:
                          prevState.selectedChecker?.color === "white" &&
                          beatedCheckers.length > 0
                            ? prevState.board.black.filter(
                                (item) =>
                                  !beatedCheckers.find(
                                    (checker) =>
                                      checker.x === item.x &&
                                      checker.y === item.y
                                  )
                              )
                            : prevState.board.black,
                      },
                    }));

                    if (!state.selectedChecker.nextMove.attacking) {
                      setState((prevState) => ({
                        ...prevState,
                        move: state.move === "black" ? "white" : "black",
                        selectedChecker: null,
                      }));
                    } else {
                      setState((prevState) => ({
                        ...prevState,
                        selectedChecker: {
                          ...prevState.selectedChecker,
                          nextMove: calculatePossibleMoves(
                            prevState.selectedChecker,
                            prevState.board
                          ),
                        },
                        attacking: true,
                      }));
                      setState((prevState) => ({
                        ...prevState,
                        move: !prevState.selectedChecker.nextMove.attacking
                          ? prevState.move === "white"
                            ? "black"
                            : "white"
                          : prevState.move,
                        attacking: prevState.selectedChecker.nextMove.attacking,
                        selectedChecker: prevState.selectedChecker.nextMove
                          .attacking
                          ? prevState.selectedChecker
                          : null,
                      }));
                    }
                  }
                }}
              >
                {blackChecker && (
                  <Checker
                    type={blackChecker.type}
                    color={"black"}
                    x={blackChecker.x}
                    y={blackChecker.y}
                    isSelected={
                      state.selectedChecker?.x === blackChecker.x &&
                      state.selectedChecker?.y === blackChecker.y
                    }
                    ref={(item) => (refs.current[i * 8 + j] = item)}
                    onClick={(event) => {
                      if (
                        state.gameIsStarted &&
                        state.move === "black" &&
                        state.mode !== "ComputerVSComputer" &&
                        !state.attacking &&
                        (attackingCheckers.length === 0 ||
                          attackingCheckers.find(
                            (checker) =>
                              checker.x === blackChecker.x &&
                              checker.y === blackChecker.y &&
                              checker.color === "black"
                          ))
                      ) {
                        event.stopPropagation();
                        setState({
                          ...state,
                          selectedChecker: { ...blackChecker, color: "black" },
                        });
                        setState((prevState) => ({
                          ...prevState,
                          selectedChecker: {
                            ...prevState.selectedChecker,
                            nextMove: calculatePossibleMoves(
                              prevState.selectedChecker,
                              prevState.board
                            ),
                          },
                        }));
                      }
                    }}
                  />
                )}
                {whiteChecker && (
                  <Checker
                    type={whiteChecker.type}
                    color={"white"}
                    x={whiteChecker.x}
                    y={whiteChecker.y}
                    isSelected={
                      state.selectedChecker?.x === whiteChecker.x &&
                      state.selectedChecker?.y === whiteChecker.y
                    }
                    ref={(item) => (refs.current[i * 8 + j] = item)}
                    onClick={(event) => {
                      if (
                        state.gameIsStarted &&
                        state.move === "white" &&
                        state.mode !== "ComputerVSComputer" &&
                        !state.attacking &&
                        (attackingCheckers.length === 0 ||
                          attackingCheckers.find(
                            (checker) =>
                              checker.x === whiteChecker.x &&
                              checker.y === whiteChecker.y &&
                              checker.color === "white"
                          ))
                      ) {
                        event.stopPropagation();
                        setState({
                          ...state,
                          selectedChecker: { ...whiteChecker, color: "white" },
                        });
                        setState((prevState) => ({
                          ...prevState,
                          selectedChecker: {
                            ...prevState.selectedChecker,
                            nextMove: calculatePossibleMoves(
                              prevState.selectedChecker,
                              prevState.board
                            ),
                          },
                        }));
                      }
                    }}
                  />
                )}
              </Cell>
            );
          })
        )}
      </div>
    </div>
  );
};

const Timer = ({ move, isRunning }) => {
  const [time, setTime] = useState(0);
  const [timeInterval, setTimeInterval] = useState(null);

  const secondsToTime = (seconds) => ({
    minutes: Math.floor(((seconds / 1000) % (60 * 60)) / 60),
    seconds: Math.ceil(((seconds / 1000) % (60 * 60)) % 60),
  });

  useEffect(() => {
    if (isRunning) {
      reset();
      start();
    } else {
      pause();
    }
  }, [isRunning]);

  const start = () =>
    setTimeInterval(
      setInterval(() => {
        setTime((time) => time + 1000);
      }, 1000)
    );

  const pause = () => clearInterval(timeInterval);

  const reset = () => {
    setTime(0);
    clearInterval(timeInterval);
  };

  return (
    <div className="flex flex-col justify-center items-center mb-10">
      <div className="flex bg-indigo-50 px-3.5 py-5 items-center justify-center rounded-xl">
        <div className="font-bold text-[5em] rounded-xl mx-3 bg-white px-10 py-2">
          {Math.floor(secondsToTime(time).minutes / 10)}
        </div>
        <div className="font-bold text-[5em] rounded-xl mx-3 bg-white px-10 py-2">
          {secondsToTime(time).minutes % 10}
        </div>
        <span className="font-bold text-[5em] mb-6 px-4">:</span>
        <div className="font-bold text-[5em] rounded-xl mx-3 bg-white px-10 py-2">
          {Math.floor(secondsToTime(time).seconds / 10)}
        </div>
        <div className="font-bold text-[5em] rounded-xl mx-3 bg-white px-10 py-2">
          {secondsToTime(time).seconds % 10}
        </div>
      </div>
      <div className="font-bold text-2xl mt-2 py-2 rounded-xl bg-indigo-50 w-full text-center">
        {move === "white" ? "White's move" : "Black's move"}
      </div>
    </div>
  );
};

const initialState = {
  winner: null,
  gameIsStarted: false,
  mode: "PlayerVSComputer",
  move: "white",
  side: "white",
  board: {
    white: [
      { type: "man", x: 0, y: 0 },
      { type: "man", x: 0, y: 2 },
      { type: "man", x: 1, y: 1 },
      { type: "man", x: 2, y: 0 },
      { type: "man", x: 2, y: 2 },
      { type: "man", x: 3, y: 1 },
      { type: "man", x: 4, y: 0 },
      { type: "man", x: 4, y: 2 },
      { type: "man", x: 5, y: 1 },
      { type: "man", x: 6, y: 0 },
      { type: "man", x: 6, y: 2 },
      { type: "man", x: 7, y: 1 },
    ],
    black: [
      { type: "man", x: 0, y: 6 },
      { type: "man", x: 1, y: 7 },
      { type: "man", x: 1, y: 5 },
      { type: "man", x: 2, y: 6 },
      { type: "man", x: 3, y: 7 },
      { type: "man", x: 3, y: 5 },
      { type: "man", x: 4, y: 6 },
      { type: "man", x: 5, y: 7 },
      { type: "man", x: 5, y: 5 },
      { type: "man", x: 6, y: 6 },
      { type: "man", x: 7, y: 7 },
      { type: "man", x: 7, y: 5 },
    ],
  },
  selectedChecker: null,
  attacking: false,
};

function App() {
  const [state, setState] = useState(initialState);

  return (
    <div className="flex flex-col xl:flex-row justify-center items-center w-full h-screen p-5">
      <header className="flex xl:me-10 mb-5 xl:mb-0 justify-between flex-col min-w-[680px] min-h-[680px]">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold text-center mb-5">
            Suicide checkers
          </h1>
          <Timer isRunning={state.gameIsStarted} move={state.move} />
        </div>
        <div className="flex flex-col">
          {state.winner && (
            <div className="text-4xl font-bold p-10 flex justify-center items-center text-center">
              {state.winner === "white" ? "White wins" : "Black wins"}
              <br />
              Congratulations!
            </div>
          )}
          <div
            className={`flex mb-2 w-full bg-indigo-50 px-2 py-2 rounded-md ${
              state.gameIsStarted ? "opacity-50" : ""
            }`}
          >
            <span
              className={`w-full text-center rounded-l px-5 py-1 cursor-pointer font-bold transition-[0.3s_ease] ${
                state.mode === "PlayerVSComputer"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-black hover:bg-neutral-50"
              }`}
              onClick={() => {
                if (!state.gameIsStarted) {
                  setState({
                    ...state,
                    mode: "PlayerVSComputer",
                    side: "white",
                    move: "white",
                    board: initialState.board,
                    winner: null,
                    selectedChecker: null,
                  });
                }
              }}
            >
              Player VS Computer
            </span>
            <span
              className={`w-full text-center px-5 py-1 cursor-pointer font-bold transition-[0.3s_ease] ${
                state.mode === "PlayerVSPlayer"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-black hover:bg-neutral-50"
              }`}
              onClick={() => {
                if (!state.gameIsStarted) {
                  setState({
                    ...state,
                    mode: "PlayerVSPlayer",
                    side: "white",
                    move: "white",
                    board: initialState.board,
                    winner: null,
                    selectedChecker: null,
                  });
                }
              }}
            >
              Player VS Player
            </span>
            <span
              className={`w-full text-center rounded-r px-5 py-1 cursor-pointer font-bold transition-[0.3s_ease] ${
                state.mode === "ComputerVSComputer"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-black hover:bg-neutral-50"
              }`}
              onClick={() => {
                if (!state.gameIsStarted) {
                  setState({
                    ...state,
                    mode: "ComputerVSComputer",
                    side: "white",
                    move: "white",
                    board: initialState.board,
                    winner: null,
                    selectedChecker: null,
                  });
                }
              }}
            >
              Computer VS Computer
            </span>
          </div>
          {state.mode === "PlayerVSComputer" && (
            <div
              className={`flex w-full mb-2 bg-indigo-50 px-2 py-2 rounded-md ${
                state.gameIsStarted ? "opacity-50" : ""
              }`}
            >
              <span
                className={`w-full text-center rounded-l px-5 py-1 cursor-pointer font-bold transition-[0.3s_ease] ${
                  state.side === "white"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-black hover:bg-neutral-50"
                }`}
                onClick={() => {
                  if (!state.gameIsStarted) {
                    setState({
                      ...state,
                      side: "white",
                      move: "white",
                      winner: null,
                      board: initialState.board,
                      selectedChecker: null,
                    });
                  }
                }}
              >
                White
              </span>
              <span
                className={`w-full text-center rounded-r px-5 py-1 cursor-pointer font-bold transition-[0.3s_ease] ${
                  state.side === "black"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-black hover:bg-neutral-50"
                }`}
                onClick={() => {
                  if (!state.gameIsStarted) {
                    setState({
                      ...state,
                      side: "black",
                      move: "white",
                      winner: null,
                      board: initialState.board,
                      selectedChecker: null,
                    });
                  }
                }}
              >
                Black
              </span>
            </div>
          )}
          {!state.gameIsStarted && (
            <span
              className={`rounded px-7 mt-2 text-center py-3 cursor-pointer font-bold transition-[0.3s_ease] bg-indigo-600 text-white hover:bg-indigo-700 ${
                state.gameIsStarted ? "opacity-50" : ""
              }`}
              onClick={() => {
                setState({
                  ...state,
                  board: initialState.board,
                  selectedChecker: null,
                  gameIsStarted: true,
                });
              }}
            >
              Start game
            </span>
          )}
          {state.gameIsStarted && (
            <span
              className="rounded mt-2 px-7 text-center py-3 cursor-pointer font-bold transition-[0.3s_ease] bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => {
                setState({
                  ...state,
                  winner: state.move === "black" ? "white" : "black",
                  gameIsStarted: false,
                });
              }}
            >
              {state.mode === "ComputerVSComputer" ? "Stop game" : "Forfeit"}
            </span>
          )}
        </div>
      </header>
      <Board
        state={state}
        setState={setState}
        onClick={() => {
          if (!state.selectedChecker?.nextMove?.attacking) {
            setState({ ...state, selectedChecker: null });
          }
        }}
      />
    </div>
  );
}

export default App;
