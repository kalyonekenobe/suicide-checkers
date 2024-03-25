export const smartMove = (move, board) => {
  const black = `[${board.black
    .map((item) => `fig(${item.type}, ${item.x}, ${item.y})`)
    .join(", ")}]`;
  const white = `[${board.white
    .map((item) => `fig(${item.type}, ${item.x}, ${item.y})`)
    .join(", ")}]`;

  return `smart_move(${move}, board(${black}, ${white}), B).`;
};

export const canMove = (move, board) => {
  const black = `[${board.black
    .map((item) => `fig(${item.type}, ${item.x}, ${item.y})`)
    .join(", ")}]`;
  const white = `[${board.white
    .map((item) => `fig(${item.type}, ${item.x}, ${item.y})`)
    .join(", ")}]`;

  return `can_move(${move}, board(${black}, ${white})).`;
};

export const parseBoard = (string) => {
  const sidesStrings = string.match(
    /\[((fig\((man|king),\s*\d+,\s*\d+\))(,\s*)*){0,12}\]/g
  );
  const blackFiguresStrings = sidesStrings[0].match(
    /fig\((man|king),\s*\d+,\s*\d+\)/g
  );

  const whiteFiguresStrings = sidesStrings[1].match(
    /fig\((man|king),\s*\d+,\s*\d+\)/g
  );

  return {
    white:
      whiteFiguresStrings?.map((figureString) => ({
        type: /(man|king)/g.exec(figureString)[0],
        x: Number(figureString.match(/\d+/g)[0]),
        y: Number(figureString.match(/\d+/g)[1]),
      })) ?? [],
    black:
      blackFiguresStrings?.map((figureString) => ({
        type: /(man|king)/g.exec(figureString)[0],
        x: Number(figureString.match(/\d+/g)[0]),
        y: Number(figureString.match(/\d+/g)[1]),
      })) ?? [],
  };
};

// export const getBoard = (result) => {
//   const { answer } = result.value;

//   if (answer) {
//     const whiteList = answer.B.args[1];
//     const blackList = answer.B.args[0];

//     return {
//       white: whiteList.map((item) => ({
//         type: item.args[0].functor,
//         x: item.args[1],
//         y: item.args[2],
//       })),
//       black: blackList.map((item) => ({
//         type: item.args[0].functor,
//         x: item.args[1],
//         y: item.args[2],
//       })),
//     };
//   } else {
//     console.log(answer);
//   }
// };
