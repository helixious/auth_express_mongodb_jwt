import express from "express";
import bodyParser from 'body-parser';
import config from './config';

const PORT = config.PORT ? config.PORT : 4000;



const app = express();

app.get("/api/auth", (req, res) => {
    res.json({message: "success"});
});

app.listen(PORT);