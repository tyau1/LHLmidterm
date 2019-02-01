"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');

// Seperated Routes for each Resource
const foodsRoutes = require("./routes/foods");
const accountSid = 'AC8d51779e1b2ffff782ba05b0c8265db4';
const authToken = '00142b9ccbafd8ea41cad4428d9d09d0';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/foods", foodsRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/menu", (req, res) => {
  res.render("menu");
});

app.post("/menu", (req, res) => {
  // const client = require('twilio')(accountSid, authToken);
  res.redirect("/confirmation");
  // client.messages.create(
  //   {
  //     to: '+16047156043',
  //     from: '+16042108661',
  //     body: 'This is the twilio test!!',
  //   },
  //   (err, message) => {
  //     console.log(message.sid);
  //     res.redirect("/confirmation");
  //   }
  // )
});

app.get("/confirmation", (req, res) => {
  res.render("confirmation");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
