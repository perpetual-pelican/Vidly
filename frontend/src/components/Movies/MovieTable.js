import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 215 },
  { field: 'title', headerName: 'Title', width: 250 },
  {
    field: 'dailyRentalRate',
    headerName: 'Daily Rental Rate',
    type: 'number',
    width: 140,
  },
  {
    field: 'numberInStock',
    headerName: '# Available',
    type: 'number',
    width: 100,
  },
  {
    field: 'genres',
    headerName: 'Genres',
    width: 350,
  },
];

const MovieTable = (props) => {
  const { movies } = props;
  const rows = movies.map((movie) => {
    let genreNames = [];
    for (const genreId in movie.genres) {
      genreNames.push(movie.genres[genreId].name);
    }
    const genres = genreNames.join(', ');
    return {
      id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
      numberInStock: movie.numberInStock,
      genres,
    };
  });

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      checkboxSelection
    />
  );
};

export default MovieTable;
