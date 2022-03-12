import express from 'express';
const app = express();
const port = 3000;
import {fileURLToPath} from 'url';
import path from 'path';

//prismic
import * as prismic from '@prismicio/client'
import {client} from './config/prismicConfig.js';
import * as prismicH from '@prismicio/helpers';

// configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  };

  next();
});

app.get('/', async (req, res) => {
  const document = await client.get({
    predicates: prismic.predicate.any('document.type', ['metad', 'home'])
  })
  const [home, meta] = document.results
  res.render('pages/home', {home, meta});
});

app.get('/about', async (req, res) => {
  const document = await client.get({
    predicates: prismic.predicate.any('document.type', ['abou', 'metad'])
  })
  const [about, meta] = document.results
  res.render('pages/about', {about, meta});
});

app.get('/collections', (req, res) => {
  res.render('pages/collections');
});

app.get('/details', (req, res) => {
  res.render('pages/details');
});

app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
});
