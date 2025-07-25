import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography
} from "@mui/material";

const BITBUCKET_CSV_URL = "https://storage.googleapis.com/run-sources-hack-team-finpro-us-central1/sales_forecast/sales_forecast_combined_predictions_cleaned.csv";

const SalesForeCast: React.FC = () => {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(BITBUCKET_CSV_URL)
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse<string[]>(csv, { skipEmptyLines: true });
        setData(parsed.data as string[][]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Sales Forecast CSV Data
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {data[0]?.map((cell, idx) => (
                <TableCell key={idx} style={{ fontWeight: "bold" }}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(1).map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SalesForeCast;