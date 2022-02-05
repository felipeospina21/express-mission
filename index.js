const express = require("express");
const phones = require("./phones");
const morgan = require("morgan");

const app = express();
const port = 8000;

morgan.token("host", (req, res) => req.hostname);
app.use(express.json());
app.use(
  morgan(
    ":host :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"
  )
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/info", (req, res) => {
  const numberOfPhones = phones.length;
  const today = new Date();
  res.send(`Phonebook has info for ${numberOfPhones} people \n ${today}`);
});

app.get("/api/personas", (req, res) => {
  res.json(phones);
});

app.post("/api/personas", (req, res) => {
  const body = req.body;
  const filtered = phones.find(phone => phone.name === body.name);
  if (!body.name || !body.phone) {
    res.status(400).send("error, name or phone missing");
  } else if (filtered) {
    res.status(400).send("error, contact allready in phonebook");
  } else {
    const newId = Math.floor(Math.random() * 1000000);
    body.id = newId;
    res.status(200).send(body);
  }
});

app.get("/api/personas/:id", (req, res) => {
  const id = Number(req.params.id);
  const phone = phones.find(phone => phone.id === id);
  phone ? res.json(phone) : res.status(400).send("not found");
});

app.delete("/api/personas/:id", (req, res) => {
  const id = Number(req.params.id);
  const newPhones = phones.filter(phone => phone.id !== id);
  newPhones.length === phones.length
    ? res.status(400).send("Not found")
    : res.status(200).send(newPhones);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
