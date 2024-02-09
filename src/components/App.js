import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import AddAlbum from './AddAlbum.js';
import AlbumsList from './AlbumList';
import UpdateAlbum from './UpdateAlbums.js';

const fetchFromApi = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Something went wrong!');
  }
};

const App = () => {
  const [albums, setAlbums] = useState([]);
  const [updateAlbum, setUpdateAlbum] = useState({});
 

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await fetchFromApi('https://jsonplaceholder.typicode.com/albums');
        setAlbums(data);
      } catch (error) {
        toast.error('Error fetching albums. Please try again later.');
      }
    };

    fetchAlbums();
  }, []);

  const deleteAlbumFromList = async (id) => {
    try {
      await fetchFromApi(`https://jsonplaceholder.typicode.com/albums/${id}`, { method: 'DELETE' });
      const newAlbums = albums.filter((album) => album.id !== id);
      setAlbums(newAlbums);
      toast.success('Your Album Deleted successfully From The List');
    } catch (error) {
      toast.error('Error deleting album. Please try again later.');
    }
  };

  const addAlbumToList = async (userId, title) => {
    try {
      const newAlbum = await fetchFromApi('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        body: JSON.stringify({ userId, title }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });
      setAlbums([...albums, newAlbum]);
      toast.success('New Album added successfully in the bottom!!');
    } catch (error) {
      toast.error('Error adding album. Please try again later.');
    }
  };

  const updateAlbumInList = async (id, updateTitle, updateUserid) => {
    try {
      let updatedAlbum = {};

      if (id < 100) {
        const response = await fetchFromApi(`https://jsonplaceholder.typicode.com/albums/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ userId: updateUserid, id, title: updateTitle }),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        updatedAlbum = response;
      } else {
        updatedAlbum = { userId: updateUserid, id, title: updateTitle };
      }

      const updatedAlbums = albums.map((album) => (album.id === id ? updatedAlbum : album));
      setAlbums(updatedAlbums);
      toast.success('Album Updated Successfully');
    } catch (error) {
      toast.error('Error updating album. Please try again later.');
    }
  };

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path='/'
          element={<AlbumsList albums={albums} setUpdateAlbum={setUpdateAlbum} deleteAlbumFromList={deleteAlbumFromList} />}
        ></Route>
        <Route path='/add-album' element={<AddAlbum addAlbumToList={addAlbumToList} />}></Route>
        <Route path='/update-album' element={<UpdateAlbum album={updateAlbum} updateAlbumInList={updateAlbumInList} />}></Route>
      </Routes>
    </>
  );
};

export default App;
