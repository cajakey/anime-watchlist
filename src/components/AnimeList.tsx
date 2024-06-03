import React, { useEffect, useState } from 'react';
import { getAnimeList, deleteAnime } from '../services/animes';
import { Anime } from '../types';
import axios from 'axios';

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
    const [wikiSummaries, setWikiSummaries] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchAnime();
    }, []);

    useEffect(() => {
        fetchAnime(filter);
    }, [filter]);

    const fetchAnime = async (titleFilter?: string) => {
        const data = await getAnimeList(titleFilter);
        setAnimeList(data);
        fetchWikiSummaries(data);
    };

    const fetchWikiSummaries = async (animeList: Anime[]) => {
        const summaries: { [key: number]: string } = {};
        for (const anime of animeList) {
            if (anime.id !== undefined) {
                try {
                    const response = await axios.get(
                        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${anime.title}`
                    );
                    const snippet = response.data.query.search[0]?.snippet;
                    if (snippet) {
                        summaries[anime.id] = snippet;
                    }
                } catch (error) {
                    console.error("Error fetching data from Wikipedia API", error);
                }
            }
        }
        setWikiSummaries(summaries);
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
                        {anime.id !== undefined && wikiSummaries[anime.id] && (
                            <p dangerouslySetInnerHTML={{ __html: wikiSummaries[anime.id] }}></p>
                        )}
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