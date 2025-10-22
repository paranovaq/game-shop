import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

const Form = ({ handleSubmit, inClient }) => {
  const [client, setClient] = useState(inClient);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setClient({ ...client, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(client);
    setClient(inClient);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: "linear-gradient(to right, #f5f7fa, #c3cfe2)",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
         Add New Client
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box component="form" onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={client.name}
              onChange={handleChange}
              variant="filled"
              size="medium"
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Surname"
              name="surname"
              value={client.surname}
              onChange={handleChange}
              variant="filled"
              size="medium"
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={client.phone}
              onChange={handleChange}
              variant="filled"
              size="medium"
              required
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
          >
             Add Client
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Form;
