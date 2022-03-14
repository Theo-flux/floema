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
  res.locals.Increment = (arg) => {
    return arg===0 ? 'One' : arg===1 ? 'Two' : arg===2 ? 'Three' : arg===3 ? 'Four' : ''
  }
  next();
});

app.get('/', async (req, res) => {
  const meta = await client.getSingle('metad')
  const home = await client.getSingle('home')
  const preloader = await client.getSingle('preloader')

  res.render('pages/home', {home, meta, preloader});
});

app.get('/about', async (req, res) => {
  const meta = await client.getSingle('metad')
  const about = await client.getSingle('abou')
  const preloader = await client.getSingle('preloader')

  res.render('pages/about', {about, meta, preloader});
});

app.get('/collections', async (req, res) => {
  const meta = await client.getSingle('metad')
  const home = await client.getSingle('home')
  const preloader = await client.getSingle('preloader')

  const { results: collections } = await client.get({
    predicates: prismic.predicate.at('document.type', 'collection'),
    fetchLinks: 'product.image'
  })


  res.render('pages/collections', {collections, home, meta, preloader});
});

app.get('/details/:uid', async (req, res) => {
  const meta = await client.getSingle('metad')
  const preloader = await client.getSingle('preloader')
  const product = await client.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })

  res.render('pages/details', {meta, preloader, product});
});

app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
});



