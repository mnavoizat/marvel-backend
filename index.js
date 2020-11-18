const express = require("express");
const formidable = require("express-formidable");
const axios = require("axios");
const md5 = require("md5");
require("dotenv").config();

const app = express();
app.use(formidable());

const public_API_key = process.env.PUBLIC_API_KEY;
const private_API_key = process.env.PRIVATE_API_KEY;

app.get("/test", async (req, res) => {
  try {
    const date = new Date();
    const timestamp = date.getTime();
    const hash = md5(timestamp + private_API_key + public_API_key);

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics?ts=${timestamp}&apikey=${public_API_key}&hash=${hash}`
    );

    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
