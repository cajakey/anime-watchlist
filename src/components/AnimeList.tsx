import React, { useEffect, useState } from 'react';
import { getAnimeList, deleteAnime } from '../services/animes';
import { Anime } from '../types';

interface AnimeListProps {
    onEdit: (anime: Anime) => void;
    onCancel: () => void;
}

const AnimeList: React.FC<AnimeListProps> = ({ onEdit, onCancel }) => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState<'title' | 'genre'>('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [editingId, setEditingId] = useState<number | undefined>();

    useEffect(() => {
        fetchAnime();
    }, []);

    const fetchAnime = async (titleFilter?: string) => {
        const data = await getAnimeList(titleFilter);
        setAnimeList(data);
    };

    const handleDelete = async (id: number | undefined) => {
        const updatedList = await deleteAnime(id);
        setAnimeList(updatedList);
    };

    const handleSort = (key: 'title' | 'genre') => {
        const order = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortOrder(order);
    };

    const handleEdit = (anime: Anime) => {
        setEditingId(anime.id);
        onEdit(anime);
    };

    const handleCancelEdit = () => {
        setEditingId(undefined);
        onCancel();
    };

    useEffect(() => {
        fetchAnime(filter);
    }, [filter]);

    const sortedAnimeList = [...animeList].sort((a, b) => {
        if (sortKey === 'title') {
            return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else {
            return sortOrder === 'asc' ? a.genre.localeCompare(b.genre) : b.genre.localeCompare(a.genre);
        }
    });

    return (
        <div>
            <input
                type="text"
                placeholder="Filter by title"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-container"
            />
            <button className="sort" onClick={() => handleSort('title')}>Sort by Title ({sortOrder})</button>
            <button className="sort" onClick={() => handleSort('genre')}>Sort by Genre ({sortOrder})</button>
            <ul>
                {sortedAnimeList.map((anime) => (
                    <li key={anime.id}>
                        {anime.title} - {anime.genre} (S{anime.season}E{anime.episode})
                        <div>
                            {editingId === anime.id ? (
                                <button className="cancel" onClick={handleCancelEdit}>Cancel</button>
                            ) : (
                                <>
                                    <button className="edit" onClick={() => handleEdit(anime)}>Edit</button>
                                    <button className="delete" onClick={() => handleDelete(anime.id)}>Delete</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnimeList;