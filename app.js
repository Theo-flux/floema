// The backend of the whole app
import path from 'path';
import express from 'express';
import errorHandler from 'errorhandler';
import { fileURLToPath } from 'url';
import * as prismicH from '@prismicio/helpers';
import { client } from './config/prismicConfig.js';

const app = express();
const port = 3000;

app.set('views');
app.set('view engine', 'pug');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'views')));
app.use(errorHandler());
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  };
  next();
});

app.get('/', async (req, res) => {
  const meta = await client.getSingle('metad');
  res.render('pages/home', { meta });
});

app.get('/about', async (req, res) => {
  const about = await client.getSingle('abou');
  const meta = await client.getSingle('metad');

  res.render('pages/about', { about, meta });
});

app.get('/collections', async (req, res) => {
  const meta = await client.getSingle('metad');

  res.render('pages/collections', { meta });
});

app.get('/details/:uid', async (req, res) => {
  const meta = await client.getSingle('metad');
  const product = await client.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title',
  });

  // console.log(product.data.highlight);
  // console.log(product.data.info);
  console.log(product.data.shop);
  // console.log(req.params.uid);

  res.render('pages/details', { product, meta });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
