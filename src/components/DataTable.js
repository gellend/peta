import { useState } from "react";
import { Box, Container, Grid, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function DataTable({ columns, rows }) {
  const [filteredRows, setFilteredRows] = useState(rows);
  const [search, setSearch] = useState("");

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);

    const filtered = rows.filter((row) =>
      Object.values(row).some((field) =>
        field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredRows(filtered);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={search}
              onChange={handleSearchChange}
              sx={{ mb: 3 }}
            />
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <DataGrid
                rows={filteredRows}
                columns={columns}
                autoPageSize
                autoHeight
                disableColumnSelector
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
