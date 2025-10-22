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

const Table = ({ clients, delClient }) => {
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
        Client List
      </Typography>
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f4ff" }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Surname</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow key={index} hover>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.surname}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => delClient(client.id)}
                  >
                     Delete
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
