import { useState, useEffect } from "react";
import "./App.css";
import img1 from "./assets/1.png";
import img2 from "./assets/2.png";
import img3 from "./assets/3.png";
import img4 from "./assets/4.png";
import img5 from "./assets/5.png";
import img6 from "./assets/6.png";
import img7 from "./assets/7.png";
import img8 from "./assets/8.png";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

type Card = {
  id: number;
  src: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function shuffleCards(): Card[] {
  const doubledImages = [...images, ...images];
  const shuffled = doubledImages
    .map((src, index) => ({
      id: index,
      src,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);
  return shuffled;
}

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [secondCard, setSecondCard] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setCards(shuffleCards());
  }, []);

  const handleCardClick = (card: Card) => {
    if (disabled || card.isFlipped || card.isMatched) return;

    if (firstCard === null) {
      setFirstCard({ ...card, isFlipped: true });
      setCards((prevCards) =>
        prevCards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
      );
    } else if (secondCard === null) {
      setSecondCard({ ...card, isFlipped: true });
      setCards((prevCards) =>
        prevCards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
      );
      setDisabled(true);

      if (firstCard.src === card.src) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.src === card.src ? { ...c, isMatched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === firstCard.id || c.id === card.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  };

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  return (
    <div className="container">
      <div className="title">Memory game</div>
      <div className="button" onClick={() => setCards(shuffleCards())}>
        New game
      </div>
      <div className="board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`board-item ${card.isFlipped ? "flipped" : ""}`}
            onClick={() => handleCardClick(card)}
          >
            {card.isFlipped || card.isMatched ? (
              <img src={card.src} alt="card" />
            ) : (
              <div className="card-back" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
