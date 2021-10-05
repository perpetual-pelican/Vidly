import React from 'react';
import { Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 80 },
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
    width: 250,
  },
];

const MovieTable = (props) => {
  const { movies } = props;
  const rows = movies.map((movie) => {
    const genres = movie.genres.map((genre) => genre.name).join(', ');
    return {
      id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
      numberInStock: movie.numberInStock,
      genres,
    };
  });

  return (
    <Grid container item>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Grid>
  );
};

export default MovieTable;
