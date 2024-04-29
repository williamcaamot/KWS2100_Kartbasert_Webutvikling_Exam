import express from "express";
import pg from "pg";
import { teigAPI } from "./api/teigAPI.js";
import cors from "cors";
import { adresseAPI } from "./api/adresseAPI.js";
import { matbutikkAPI } from "./api/matbutikkAPI.js";

const app = express();
const port = 3001;
const caCert = Buffer.from(process.env.CA_CERT_DO, "base64").toString("utf-8");

app.use(cors());

const pgPool = new pg.Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
  },
});

app.use("", teigAPI(pgPool));
app.use("", adresseAPI(pgPool));
app.use("", matbutikkAPI(pgPool));

app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port ${process.env.PORT || port}`);
});
