const express = require("express");
const db = require("../data/dbConfig.js");

const add = user => {
  return db("users").insert(user);
};

function findBy(filter) {
  return db("users").where(filter);
}

function find() {
  return db("users").select("id", "username");
}

module.exports = {
  add,
  findBy,
  find
};
