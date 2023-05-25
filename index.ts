import dotenv from 'dotenv';
dotenv.config();

import serverless from 'serverless-http';
import express from 'express';
import cors from "cors";
import api from './routes/api';
const app = express()
const port = 3000
  
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
)

app.use(express.json());

app.use("/", api);

 
module.exports.handler = serverless(app);
