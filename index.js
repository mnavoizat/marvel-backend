require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const axios = require("axios");
const md5 = require("md5");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

const public_API_key = process.env.PUBLIC_API_KEY;
const private_API_key = process.env.PRIVATE_API_KEY;

app.get("/test", (req, res) => {
  try {
    res.json("bien reçu");
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/comics", async (req, res) => {
  try {
    let { offset, search } = req.query;

    const date = new Date();
    const timestamp = date.getTime();
    const hash = md5(timestamp + private_API_key + public_API_key);

    if (!offset) {
      offset = 0;
    }
    if (!search) {
      search = "";
    }

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics?ts=${timestamp}&apikey=${public_API_key}&hash=${hash}&limit=100&offset=${offset}&orderBy=title&titleStartsWith=${search}`
    );
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/characters", async (req, res) => {
  try {
    let { offset, search } = req.query;

    const date = new Date();
    const timestamp = date.getTime();
    const hash = md5(timestamp + private_API_key + public_API_key);

    if (!offset) {
      offset = 0;
    }
    if (!search) {
      const response = await axios.get(
        `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${public_API_key}&hash=${hash}&limit=100&offset=${offset}&orderBy=name`
      );
      res.json(response.data);
    } else {
      const regex = new RegExp(search, "ig");
      const searchResults = [];
      for (let i = 0; i < 2; i++) {
        const response = await axios.get(
          `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&apikey=${public_API_key}&hash=${hash}&limit=100&offset=${
            i * 100
          }`
        );
        const res = response.data.data.results;

        for (let j = 0; j < res.length; j++) {
          if (res[j].name.match(regex)) {
            searchResults.push(res[j]);
          }
        }
      }
      res.json({
        data: { results: searchResults, total: searchResults.length },
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/character/comics", async (req, res) => {
  try {
    let { id } = req.query;

    const date = new Date();
    const timestamp = date.getTime();
    const hash = md5(timestamp + private_API_key + public_API_key);

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters/${id}/comics?ts=${timestamp}&apikey=${public_API_key}&hash=${hash}`
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/character", async (req, res) => {
  try {
    let { id } = req.query;

    const date = new Date();
    const timestamp = date.getTime();
    const hash = md5(timestamp + private_API_key + public_API_key);

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters/${id}?ts=${timestamp}&apikey=${public_API_key}&hash=${hash}`
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/comic", async (req, res) => {
  try {
    let { id } = req.query;

    const date = new Date();
    const timestamp = date.getTime();
    const hash = md5(timestamp + private_API_key + public_API_key);

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics/${id}?ts=${timestamp}&apikey=${public_API_key}&hash=${hash}`
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
