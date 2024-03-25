export const calculatePossibleMoves = (selectedChecker, board) => {
  if (selectedChecker) {
    const blackChecker = board.black.find(
      (checker) =>
        checker.x === selectedChecker.x && checker.y === selectedChecker.y
    );
    const whiteChecker = board.white.find(
      (checker) =>
        checker.x === selectedChecker.x && checker.y === selectedChecker.y
    );

    const x = selectedChecker.x;
    const y = selectedChecker.y;

    const enemies = structuredClone(blackChecker ? board.white : board.black);

    const allies = structuredClone(blackChecker ? board.black : board.white);

    const all = [...enemies, ...allies];

    if (selectedChecker.type === "man") {
      const topLeftChecker = enemies.find(
        (enemy) => enemy.x === x - 1 && enemy.y === y + 1
      );
      const topRightChecker = enemies.find(
        (enemy) => enemy.x === x + 1 && enemy.y === y + 1
      );
      const bottomLeftChecker = enemies.find(
        (enemy) => enemy.x === x - 1 && enemy.y === y - 1
      );
      const bottomRightChecker = enemies.find(
        (enemy) => enemy.x === x + 1 && enemy.y === y - 1
      );

      const moveState = {
        attacking: false,
        possibleMoves: [],
      };

      if (
        (!topLeftChecker ||
          all.find(
            (item) =>
              item.x === topLeftChecker.x - 1 && item.y === topLeftChecker.y + 1
          ) ||
          topLeftChecker.x === 0 ||
          topLeftChecker.y === 7) &&
        (!topRightChecker ||
          all.find(
            (item) =>
              item.x === topRightChecker.x + 1 &&
              item.y === topRightChecker.y + 1
          ) ||
          topRightChecker.x === 7 ||
          topRightChecker.y === 7) &&
        (!bottomLeftChecker ||
          all.find(
            (item) =>
              item.x === bottomLeftChecker.x - 1 &&
              item.y === bottomLeftChecker.y - 1
          ) ||
          bottomLeftChecker.x === 0 ||
          bottomLeftChecker.y === 0) &&
        (!bottomRightChecker ||
          all.find(
            (item) =>
              item.x === bottomRightChecker.x + 1 &&
              item.y === bottomRightChecker.y - 1
          ) ||
          bottomRightChecker.x === 7 ||
          bottomRightChecker.y === 0)
      ) {
        if (
          x < 7 &&
          !all.find(
            (item) => item.x === x + 1 && item.y === y + (whiteChecker ? 1 : -1)
          )
        ) {
          moveState.possibleMoves.push({
            x: x + 1,
            y: y + (whiteChecker ? 1 : -1),
          });
        }

        if (
          x > 0 &&
          !all.find(
            (item) => item.x === x - 1 && item.y === y + (whiteChecker ? 1 : -1)
          )
        ) {
          moveState.possibleMoves.push({
            x: x - 1,
            y: y + (whiteChecker ? 1 : -1),
          });
        }
      } else {
        if (
          bottomLeftChecker &&
          bottomLeftChecker?.x > 0 &&
          bottomLeftChecker?.y > 0 &&
          !all.find(
            (item) =>
              item.x === bottomLeftChecker.x - 1 &&
              item.y === bottomLeftChecker.y - 1
          )
        ) {
          moveState.attacking = true;
          moveState.possibleMoves.push({
            x: bottomLeftChecker.x - 1,
            y: bottomLeftChecker.y - 1,
          });
        }

        if (
          bottomRightChecker &&
          bottomRightChecker.x < 7 &&
          bottomRightChecker.y > 0 &&
          !all.find(
            (item) =>
              item.x === bottomRightChecker.x + 1 &&
              item.y === bottomRightChecker.y - 1
          )
        ) {
          moveState.attacking = true;
          moveState.possibleMoves.push({
            x: bottomRightChecker.x + 1,
            y: bottomRightChecker.y - 1,
          });
        }

        if (
          topLeftChecker &&
          topLeftChecker.x > 0 &&
          topLeftChecker.y < 7 &&
          !all.find(
            (item) =>
              item.x === topLeftChecker.x - 1 && item.y === topLeftChecker.y + 1
          )
        ) {
          moveState.attacking = true;
          moveState.possibleMoves.push({
            x: topLeftChecker.x - 1,
            y: topLeftChecker.y + 1,
          });
        }

        if (
          topRightChecker &&
          topRightChecker.x < 7 &&
          topRightChecker.y < 7 &&
          !all.find(
            (item) =>
              item.x === topRightChecker.x + 1 &&
              item.y === topRightChecker.y + 1
          )
        ) {
          moveState.attacking = true;
          moveState.possibleMoves.push({
            x: topRightChecker.x + 1,
            y: topRightChecker.y + 1,
          });
        }
      }

      return moveState;
    } else {
      const {
        topLeftChecker,
        topRightChecker,
        bottomLeftChecker,
        bottomRightChecker,
      } = findEnemiesForKing(x, y, enemies, allies);

      const moveState = {
        attacking: false,
        possibleMoves: [],
      };

      if (
        (!topLeftChecker ||
          all.find(
            (item) =>
              item.x === topLeftChecker.x - 1 && item.y === topLeftChecker.y + 1
          )) &&
        (!topRightChecker ||
          all.find(
            (item) =>
              item.x === topRightChecker.x + 1 &&
              item.y === topRightChecker.y + 1
          )) &&
        (!bottomLeftChecker ||
          all.find(
            (item) =>
              item.x === bottomLeftChecker.x - 1 &&
              item.y === bottomLeftChecker.y - 1
          )) &&
        (!bottomRightChecker ||
          all.find(
            (item) =>
              item.x === bottomRightChecker.x + 1 &&
              item.y === bottomRightChecker.y - 1
          ))
      ) {
        for (
          let i = y + 1, j = x + 1;
          i <= 7 && j <= 7 && !all.find((item) => item.x === j && item.y === i);
          i++, j++
        ) {
          moveState.possibleMoves.push({ x: j, y: i });
        }

        for (
          let i = y + 1, j = x - 1;
          i <= 7 && j >= 0 && !all.find((item) => item.x === j && item.y === i);
          i++, j--
        ) {
          moveState.possibleMoves.push({ x: j, y: i });
        }

        for (
          let i = y - 1, j = x + 1;
          i >= 0 && j <= 7 && !all.find((item) => item.x === j && item.y === i);
          i--, j++
        ) {
          moveState.possibleMoves.push({ x: j, y: i });
        }

        for (
          let i = y - 1, j = x - 1;
          i >= 0 && j >= 0 && !all.find((item) => item.x === j && item.y === i);
          i--, j--
        ) {
          moveState.possibleMoves.push({ x: j, y: i });
        }
      } else {
        const moves = [];
        const attackingMoves = [];

        if (topRightChecker) {
          for (
            let i = topRightChecker.y + 1, j = topRightChecker.x + 1;
            i <= 7 &&
            j <= 7 &&
            !all.find((item) => item.x === j && item.y === i);
            i++, j++
          ) {
            moves.push({ x: j, y: i });
            const {
              topLeftChecker: a,
              topRightChecker: b,
              bottomLeftChecker: c,
              bottomRightChecker: d,
            } = findEnemiesForKing(j, i, enemies, allies);

            if (
              a &&
              !all.find((item) => item.x === a.x - 1 && item.y === a.y + 1) &&
              !(a.x === topRightChecker.x && a.y === topRightChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              b &&
              !all.find((item) => item.x === b.x + 1 && item.y === b.y + 1) &&
              !(b.x === topRightChecker.x && b.y === topRightChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              c &&
              !all.find((item) => item.x === c.x - 1 && item.y === c.y - 1) &&
              !(c.x === topRightChecker.x && c.y === topRightChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              d &&
              !all.find((item) => item.x === d.x + 1 && item.y === d.y - 1) &&
              !(d.x === topRightChecker.x && d.y === topRightChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }
          }
        }

        if (topLeftChecker) {
          for (
            let i = topLeftChecker.y + 1, j = topLeftChecker.x - 1;
            i <= 7 &&
            j >= 0 &&
            !all.find((item) => item.x === j && item.y === i);
            i++, j--
          ) {
            moves.push({ x: j, y: i });
            const {
              topLeftChecker: a,
              topRightChecker: b,
              bottomLeftChecker: c,
              bottomRightChecker: d,
            } = findEnemiesForKing(j, i, enemies, allies);

            if (
              a &&
              !all.find((item) => item.x === a.x - 1 && item.y === a.y + 1) &&
              !(a.x === topLeftChecker.x && a.y === topLeftChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              b &&
              !all.find((item) => item.x === b.x + 1 && item.y === b.y + 1) &&
              !(b.x === topLeftChecker.x && b.y === topLeftChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              c &&
              !all.find((item) => item.x === c.x - 1 && item.y === c.y - 1) &&
              !(c.x === topLeftChecker.x && c.y === topLeftChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              d &&
              !all.find((item) => item.x === d.x + 1 && item.y === d.y - 1) &&
              !(d.x === topLeftChecker.x && d.y === topLeftChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }
          }
        }

        if (bottomRightChecker) {
          for (
            let i = bottomRightChecker.y - 1, j = bottomRightChecker.x + 1;
            i >= 0 &&
            j <= 7 &&
            !all.find((item) => item.x === j && item.y === i);
            i--, j++
          ) {
            moves.push({ x: j, y: i });
            const {
              topLeftChecker: a,
              topRightChecker: b,
              bottomLeftChecker: c,
              bottomRightChecker: d,
            } = findEnemiesForKing(j, i, enemies, allies);

            if (
              a &&
              !all.find((item) => item.x === a.x - 1 && item.y === a.y + 1) &&
              !(a.x === bottomRightChecker.x && a.y === bottomRightChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              b &&
              !all.find((item) => item.x === b.x + 1 && item.y === b.y + 1) &&
              !(b.x === bottomRightChecker.x && b.y === bottomRightChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              c &&
              !all.find((item) => item.x === c.x - 1 && item.y === c.y - 1) &&
              !(c.x === bottomRightChecker.x && c.y === bottomRightChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              d &&
              !all.find((item) => item.x === d.x + 1 && item.y === d.y - 1) &&
              !(d.x === bottomRightChecker.x && d.y === bottomRightChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }
          }
        }

        if (bottomLeftChecker) {
          for (
            let i = bottomLeftChecker.y - 1, j = bottomLeftChecker.x - 1;
            i >= 0 &&
            j >= 0 &&
            !all.find((item) => item.x === j && item.y === i);
            i--, j--
          ) {
            moves.push({ x: j, y: i });
            const {
              topLeftChecker: a,
              topRightChecker: b,
              bottomLeftChecker: c,
              bottomRightChecker: d,
            } = findEnemiesForKing(j, i, enemies, allies);

            if (
              a &&
              !all.find((item) => item.x === a.x - 1 && item.y === a.y + 1) &&
              !(a.x === bottomLeftChecker.x && a.y === bottomLeftChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              b &&
              !all.find((item) => item.x === b.x + 1 && item.y === b.y + 1) &&
              !(b.x === bottomLeftChecker.x && b.y === bottomLeftChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              c &&
              !all.find((item) => item.x === c.x - 1 && item.y === c.y - 1) &&
              !(c.x === bottomLeftChecker.x && c.y === bottomLeftChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }

            if (
              d &&
              !all.find((item) => item.x === d.x + 1 && item.y === d.y - 1) &&
              !(d.x === bottomLeftChecker.x && d.y === bottomLeftChecker.y)
            ) {
              attackingMoves.push({ x: j, y: i });
            }
          }
        }

        if (attackingMoves.length > 0) moveState.possibleMoves = attackingMoves;
        else moveState.possibleMoves = moves;

        if (moveState.possibleMoves.length > 0) moveState.attacking = true;

        moveState.possibleMoves = moveState.possibleMoves.filter((move) => {
          if (move.x > x && move.y > y) {
            return !selectedChecker.beatedCheckers?.find(
              (checker) =>
                checker.x < move.x &&
                checker.y < move.y &&
                checker.x > x &&
                checker.y > y
            );
          }

          if (move.x < x && move.y > y) {
            return !selectedChecker.beatedCheckers?.find(
              (checker) =>
                checker.x > move.x &&
                checker.y < move.y &&
                checker.x < x &&
                checker.y > y
            );
          }

          if (move.x > x && move.y < y) {
            return !selectedChecker.beatedCheckers?.find(
              (checker) =>
                checker.x < move.x &&
                checker.y > move.y &&
                checker.x > x &&
                checker.y < y
            );
          }

          if (move.x < x && move.y < y) {
            return !selectedChecker.beatedCheckers?.find(
              (checker) =>
                checker.x > move.x &&
                checker.y > move.y &&
                checker.x < x &&
                checker.y < y
            );
          }
        });

        if (moveState.possibleMoves.length === 0) moveState.attacking = false;
      }

      return moveState;
    }
  }
};

const findEnemiesForKing = (x, y, enemies, allies) => {
  let topLeftChecker, topRightChecker, bottomLeftChecker, bottomRightChecker;
  const all = [...enemies, ...allies];

  for (let i = y + 1, j = x + 1; i < 7 && j < 7; i++, j++) {
    if (allies.find((item) => item.x === j && item.y === i)) break;
    topRightChecker = enemies.find((enemy) => enemy.x === j && enemy.y === i);
    if (topRightChecker) break;
  }

  for (let i = y + 1, j = x - 1; i < 7 && j > 0; i++, j--) {
    if (allies.find((item) => item.x === j && item.y === i)) break;
    topLeftChecker = enemies.find((enemy) => enemy.x === j && enemy.y === i);
    if (topLeftChecker) break;
  }

  for (let i = y - 1, j = x + 1; i > 0 && j < 7; i--, j++) {
    if (allies.find((item) => item.x === j && item.y === i)) break;
    bottomRightChecker = enemies.find(
      (enemy) => enemy.x === j && enemy.y === i
    );
    if (bottomRightChecker) break;
  }

  for (let i = y - 1, j = x - 1; i > 0 && j > 0; i--, j--) {
    if (allies.find((item) => item.x === j && item.y === i)) break;
    // if (!all.find((item) => item.x === j - 1 && item.y === i - 1)) {
    bottomLeftChecker = enemies.find((enemy) => enemy.x === j && enemy.y === i);
    // }
    if (bottomLeftChecker) break;
  }

  return {
    topLeftChecker,
    topRightChecker,
    bottomLeftChecker,
    bottomRightChecker,
  };
};
