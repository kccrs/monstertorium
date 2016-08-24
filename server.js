const express = require('express');
const app = express();  // create our server called app, creates express app

// if I get any requests that come in to the slash, send back hello
// app.get('/', (request, response) => {
//   response.send('Hello World!');
// });

// app.get('/:name', (request, response) => {
//   const name = request.params.name;
//   response.send(`Hello ${name}!`);
// });



app.get('/monsters', (request, response) => {
  response.send({ monsters: app.locals.monsters });
});

app.locals.monsters = [];  // will get emptied every time we kill the server

app.use(express.static('public')); // how does this work?  who cares?

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/monsters', (request, response) => {
  const monster = request.body.monster;

  monster.id = monster.id || Date.now();
  app.locals.monsters.push(monster);

  response.status(201).send({ monster: monster });
});

app.put('/monsters/:id', (request, response) => {
  const monster = request.body.monster;
  const id = parseInt(request.params.id, 10);
  const index = app.locals.monsters.findIndex((m) => m.id === id);

  if (index === -1) { return response.sendStatus(404); }

  const oldMonster = app.locals.monsters[index];
  app.locals.monsters[index] = Object.assign(oldMonster, monster);

  return response.sendStatus(204);
});

app.delete('/monsters/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);
  if (!app.locals.monsters.find((m) => m.id === id)) {
    return response.status(404).send({
      error: `There is no monster with the "id" of ${id}.`
    });
  }
  app.locals.monsters = app.locals.monsters.filter((m) => m.id !== id);
  response.sendStatus(204);
});

// app should start up and start listening for requests
if (!module.parent) {
  app.listen(3000, () => {
    console.log('The Monstertorium is live! (http://localhost:3000)');
  });
}

module.exports = app;
