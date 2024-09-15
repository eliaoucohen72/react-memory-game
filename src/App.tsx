import { useState, useEffect } from "react";
import "./App.css";
import imagesPromise from "./assets";

type Card = {
  id: number;
  src: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const initialImageCount = 2;

function shuffleCards(images: string[], imageCount: number): Card[] {
  const selectedImages = images.slice(0, imageCount);
  const doubledImages = [...selectedImages, ...selectedImages];
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
  const [successCount, setSuccessCount] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0); // Keep track of matched pairs for the current level
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    imagesPromise.then((loadedImages) => {
      setImages(Object.values(loadedImages));
    });
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const imageCount = initialImageCount + successCount * 2;
      setCards(shuffleCards(images, imageCount));
      setMatchedPairs(0); // Reset matched pairs count when level changes
    }
  }, [successCount, images]);

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
        setMatchedPairs((prev) => prev + 1); // Increment the matched pairs count

        // Check if all pairs are matched for the current level
        if (matchedPairs + 1 === cards.length / 2) {
          setSuccessCount((prevCount) => prevCount + 1); // Move to next level
        }

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
      <div className="button" onClick={() => setSuccessCount(0)}>
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
