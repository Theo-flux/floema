// The backend of the whole app
import path from 'path';
import express from 'express';
import errorHandler from 'errorhandler';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import * as prismicH from '@prismicio/helpers';
import { client } from './config/prismicConfig.js';

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handleLinkResolver = doc => {
  if (doc.type === 'product') {
    return `/details/${doc.slug}`;
  }

  if (doc.type === 'collections') {
    return '/collections';
  }

  if (doc.type === 'abou') {
    return '/about';
  }

  return '/';
};

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  };

  res.locals.Link = handleLinkResolver;

  res.locals.Numbers = index => {
    return index === 0
      ? 'one'
      : index === 1
      ? 'two'
      : index === 2
      ? 'three'
      : index === 3
      ? 'four'
      : '';
  };

  next();
});

app.set('views');
app.set('view engine', 'pug');

const handleRequest = async client => {
  const meta = await client.getSingle('metad');
  const navigation = await client.getSingle('navigation');
  const preloader = await client.getSingle('preloader');

  return {
    meta,
    navigation,
    preloader,
  };
};

app.get('/', async (req, res) => {
  const defaults = await handleRequest(client);
  const { results: collections } = await client.getByType('collection', {
    fetchLinks: 'product.image',
  });
  const home = await client.getSingle('home');

  res.render('pages/home', { ...defaults, collections, home });
});

app.get('/about', async (req, res) => {
  const defaults = await handleRequest(client);
  const about = await client.getSingle('abou');

  res.render('pages/about', { ...defaults, about });
});

app.get('/collections', async (req, res) => {
  const defaults = await handleRequest(client);
  const home = await client.getSingle('home');
  const { results: collections } = await client.getByType('collection', {
    fetchLinks: 'product.image',
  });

  res.render('pages/collections', { ...defaults, collections, home });
});

app.get('/details/:uid', async (req, res) => {
  const defaults = await handleRequest(client);
  const product = await client.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title',
  });

  res.render('pages/details', { ...defaults, product });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
