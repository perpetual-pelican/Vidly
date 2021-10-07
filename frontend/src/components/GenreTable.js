import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 215 },
  { field: 'name', headerName: 'Name', width: 250 },
  {
    field: 'movies',
    headerName: 'Movies',
    width: 500,
  },
];

const GenreTable = (props) => {
  const { genres, movies } = props;
  const rows = genres.map((genre) => {
    const movieNameList = movies
      .filter((movie) => movie.genres[genre._id])
      .map((movie) => movie.title);
    const movieNames = movieNameList.join(', ');
    return {
      id: genre._id,
      name: genre.name,
      movies: movieNames,
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

export default GenreTable;
