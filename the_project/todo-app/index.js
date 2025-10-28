//  a web server that outputs "Server started in port NNNN"
import express from "express";
import { v7 as uuidv7 } from "uuid";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); 
const app = express();
const port = process.env.TODO_PORT || 3000;

// Generate random string once on startup
const randomId = uuidv7();
console.log(`Server started in port ${port}`);
console.log(`Application started. Session ID: ${randomId}`);


app.get('/', function (req, res) {
  res.send(`Server started in port ${port}`);
});
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
