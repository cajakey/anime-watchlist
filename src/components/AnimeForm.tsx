import React, { useState, useEffect } from 'react';
import { createAnime, updateAnime } from '../services/animes';
import { Anime } from '../types';

interface AnimeFormProps {
    currentAnime?: Anime;
    onSuccess: () => void;
}

const AnimeForm: React.FC<AnimeFormProps> = ({ currentAnime, onSuccess }) => {
    const [title, setTitle] = useState(currentAnime?.title || '');
    const [genre, setGenre] = useState(currentAnime?.genre || '');
    const [season, setSeason] = useState(currentAnime?.season || '');
    const [episode, setEpisode] = useState(currentAnime?.episode || '');

    useEffect(() => {
        if (currentAnime) {
            setTitle(currentAnime.title);
            setGenre(currentAnime.genre);
            setSeason(currentAnime.season);
            setEpisode(currentAnime.episode);
        }
    }, [currentAnime]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const anime: Anime = { title, genre, season, episode };
        if (currentAnime?.title) {
            await updateAnime(currentAnime.id, anime);
        } else {
            await createAnime(anime);
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Genre</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Season</label>
                <input
                    type="number"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Episode</label>
                <input
                    type="number"
                    value={episode}
                    onChange={(e) => setEpisode(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{currentAnime?.title ? 'Update' : 'Add'}</button>
        </form>
    );
};

export default AnimeForm;