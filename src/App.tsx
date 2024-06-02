import React, { useState } from 'react';
import AnimeList from './components/AnimeList';
import AnimeForm from './components/AnimeForm';
import { Anime } from './types';

const App: React.FC = () => {
  const [refresh, setRefresh] = useState(0);
  const [currentAnime, setCurrentAnime] = useState<Anime | undefined>();

  const init = { title: '', genre: '', season: '', episode: '' };

  const handleSuccess = () => {
    setRefresh(refresh + 1);
    setCurrentAnime(init);
  };

  const handleEdit = (anime: Anime) => {
    setCurrentAnime(anime);
  };

  const handleCancelEdit = () => {
    setCurrentAnime(init);
  };

  return (
    <div className="container">
      <h1>Anime Watch List</h1>
      <AnimeForm currentAnime={currentAnime} onSuccess={handleSuccess} />
      <AnimeList key={refresh} onEdit={handleEdit} onCancel={handleCancelEdit} />
    </div>
  );
};

export default App;