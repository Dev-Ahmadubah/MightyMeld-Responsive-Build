import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <div className="flex flex-col justify-center items-center mx-auto size-80 bg-pink-50 rounded-lg md:rounded-xl  sm:size-[400px] md:size-[450px] lg:size-[500px] lg:mx-auto mt-20">
      <h1 className="text-pink-500 font-bold text-4xl sm:text-5xl md:text-6xl">
        Memory
      </h1>
      <p className="text-pink-400 mt-5 sm:mt-8 md:mt-12 text-md sm:text-md md:text-xl lg:text-2xl font-medium">
        Flip over tiles looking for pairs
      </p>
      <button
        onClick={start}
        className="bg-gradient-to-b from-pink-400 to-pink-600 text-white py-2 px-12 sm:px-14 md:px-16 lg:px-20 rounded-full text-xl sm:px-14 md:text-2xl font-semibold mt-10 sm:mt-12 md:mt-14 lg:mt-16"
      >
        Play
      </button>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <p className="text-center text-indigo-500 text-lg md:text-xl lg:text-2xl font-medium mt-20">
        Tries{" "}
        <span className="bg-indigo-200 px-2 ml-1 rounded-md font-semibold">
          {tryCount}
        </span>
      </p>
      <div className="mt-10 mx-auto size-80 sm:size-[400px] md:size-[450px] lg:size-[500px] lg:mx-auto rounded-lg md:rounded-xl bg-indigo-50 grid grid-cols-4 place-items-center p-2 sm:p-4 lg:p-6">
        {getTiles(16).map((tile, i) => (
          <Tile key={i} flip={() => flip(i)} {...tile} />
        ))}
      </div>
    </>
  );
}
