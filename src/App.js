import './App.css';
import Images from './Images';
import { useState } from "react";
import { shuffle } from 'lodash';

function App() {
  const [cards, setCards] = useState(shuffle([...Images, ...Images]));
  const [clicks, setClicks] = useState(0);
  const [won, setWon] = useState(false);
  const [activeCards, setActiveCards] = useState([]);
  const [foundPairs, setFoundPairs] = useState([]);

  const matchSound = process.env.PUBLIC_URL + '/card-match.mp3';
  const mismatchSound = process.env.PUBLIC_URL + '/card-mismatch.mp3';

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.play();
  };

  function flipCard(index) {
    if (won) {
      setCards(shuffle([...Images, ...Images]));
      setFoundPairs([]);
      setWon(false);
      setClicks(0);
    }
    if (activeCards.length === 0) {
      setActiveCards([index]);
    }
    if (activeCards.length === 1) {
      const firstIndex = activeCards[0];
      const secondsIndex = index;
      if (cards[firstIndex] === cards[secondsIndex]) {
        if (foundPairs.length + 2 === cards.length) {
          setWon(true);
        }
        setFoundPairs([...foundPairs, firstIndex, secondsIndex]);
        playSound(matchSound); // Play match sound
      } else {
        playSound(mismatchSound); // Play mismatch sound
      }
      setActiveCards([...activeCards, index]);
    }
    if (activeCards.length === 2) {
      setActiveCards([index]);
    }
    setClicks(clicks + 1);
  }

  return (
    <div>
      <div className="board">
        {cards.map((card, index) => {
          const flippedToFront = (activeCards.indexOf(index) !== -1) || foundPairs.indexOf(index) !== -1;
          return (
            <div className={"card-outer " + (flippedToFront ? 'flipped' : '')}
                 onClick={() => flipCard(index)}>
              <div className="card">
                <div className="front">
                  <img src={card} alt="" />
                </div>
                <div className="back" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="stats">
        {won && (
          <>You won the game! Congratulations!<br />
            Click any card to play again.<br /><br />
          </>
        )}
        Clicks: {clicks} &nbsp;&nbsp;&nbsp; Found pairs:{foundPairs.length / 2}
      </div>
    </div>
  );
}

export default App;
