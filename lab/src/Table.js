import React from "react";
import {
  Table as MuiTable,
  TableContainer,
  Button,
  TableBody,
  TableRow,
  TableHead,
  Paper,
  TableCell,
  Typography,
} from "@mui/material";

const Table = ({ games, deleteGame }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: "linear-gradient(to right, #e0eafc, #cfdef3)",
      }}
    >
      <Typography
        variant="h5"
        sx={{ p: 2, fontWeight: "bold", backgroundColor: "#1976d2", color: "#fff" }}
      >
        🎯 Game Store Catalog
      </Typography>
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f4ff" }}>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Genre</strong></TableCell>
              <TableCell><strong>Release Date</strong></TableCell>
              <TableCell><strong>Developer</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game, index) => (
              <TableRow key={index} hover>
                <TableCell><strong>{game.title}</strong></TableCell>
                <TableCell>{game.genre}</TableCell>
                <TableCell>{game.releaseDate}</TableCell>
                <TableCell>{game.developer}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => deleteGame(game.id)}
                  >
                    🗑️ Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
};

export default Table;