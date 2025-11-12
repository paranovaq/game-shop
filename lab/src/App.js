import './App.css';
import GameAPI from "./api/services";
import Table from "./Table";
import Form from "./Form";
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "gameStore";

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const storedGames = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    } else {
      const initialGames = GameAPI.all();
      setGames(initialGames);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialGames));
    }
  }, []);

  const deleteGame = (id) => {
    if (GameAPI.delete(id)) {
      const updatedGames = games.filter((game) => game.id !== id);
      setGames(updatedGames);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedGames));
    }
  };

  const addGame = (game) => {
    const newGame = GameAPI.add(game);
    if (newGame) {
      const updatedGames = [...games, newGame];
      setGames(updatedGames);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedGames));
    }
  };

  // Функция для обработки покупки (можно расширить логикой)
  const handlePurchase = (gameId) => {
    console.log(`Game ${gameId} purchased`);
    // Здесь можно добавить логику обработки покупки
    // Например, отправка на сервер, обновление состояния и т.д.
  };

  return (
    <div className="App" style={{ padding: '20px', backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Form handleSubmit={addGame} initialGame={{ title: "", genre: "", releaseDate: "", developer: "", price: "" }} />
        <Table games={games} deleteGame={deleteGame} onPurchase={handlePurchase} />
      </div>
    </div>
  );
}

export default App;