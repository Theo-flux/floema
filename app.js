import express from 'express';
const app = express();
const port = 3000;
import {fileURLToPath} from 'url';
import path from 'path';
import errorHandler from 'errorhandler'

//prismic
import * as prismic from '@prismicio/client'
import {client} from './config/prismicConfig.js';
import * as prismicH from '@prismicio/helpers';
import { url } from 'inspector';

// configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app middlewares
app.use(errorHandler())
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  };

  next();
});

app.get('/', async (req, res) => {
  const meta = await client.getSingle('metad')
  const home = await client.getSingle('home')

  res.render('pages/home', {home, meta});
});

app.get('/about', async (req, res) => {
  const meta = await client.getSingle('metad')
  const about = await client.getSingle('abou')

  res.render('pages/about', {about, meta});
});

app.get('/collections', async (req, res) => {
  const meta = await client.getSingle('metad')
  const { results: collection } = await client.get({
    predicates: prismic.predicate.at('document.type', 'collection'),
    fetchLinks: 'product.image'
  })
  console.log(collection)
  collection.forEach((el) => {
    console.log(el.data.product[0].product_products)
  })
  res.render('pages/collections', {meta, collection});
});

app.get('/details/:uid', async (req, res) => {
  const meta = await client.getSingle('metad')
  const product = await client.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })

  res.render('pages/details', {meta, product});
});

app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
});



