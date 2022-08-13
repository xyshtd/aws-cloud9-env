const pg = require('pg');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const client = new pg.Client('postgres://localhost/acme_db');
client.connect();

client.query(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
     name VARCHAR(255)
    );
  
`)
  .then(()=> {
      return Promise.all([
          client.query('insert into users(name) values($1)', ['moe']),
          client.query('insert into users(name) values($1)', ['lucy'])
      ]);
  })
  .then(()=> {
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  });


app.get('/', (req, res, next)=> {
    client.query('select * from users;')
    .then( response => res.send(response.rows))
    .catch(next);
});
