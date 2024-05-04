import { produce } from "immer";
import { useCallback, useRef, useState } from "react";

const Components = () => {
  const numberOfColumns = 10;
  const numberOfRows = 10;
  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
  ];
  const emptyGrid = (): number[][] =>
    Array(numberOfRows).fill(Array(numberOfColumns).fill(0));
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const [grids, setGrids] = useState<number[][]>(() => emptyGrid());
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrids((prev) => {
      return produce(prev, (state) => {
        for (let i = 0; i < numberOfRows; i++) {
          for (let j = 0; j < numberOfColumns; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (
                newI >= 0 &&
                newI < numberOfRows &&
                newJ >= 0 &&
                newJ < numberOfColumns
              ) {
                neighbors += prev[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              state[i][j] = 0;
            } else if (prev[i][j] === 0 && neighbors === 3) {
              state[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 1000);
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          const rows: number[][] = Array(numberOfRows)
            .fill(0)
            .map(() =>
              Array(numberOfColumns)
                .fill(0)
                .map(() => (Math.random() > 0.7 ? 1 : 0))
            );
          setGrids(rows);
        }}
      >
        Randomize Grid
      </button>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numberOfColumns}, 20px)`,
        }}
      >
        {grids.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: col === 1 ? "black" : undefined,
                border: "solid 1px gray",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Components;
