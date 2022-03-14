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


// linkresolver
const handleLinkresolver = (doc) => {
  console.log(doc)

  if(doc.type === 'product'){
    return `/details/${doc.slug}`
  }

  if(doc.type === 'abou'){
    return `/about`
  }

  if(doc.type === 'collections'){
    return `/collections`
  }
}


// app middlewares
app.use(errorHandler())
app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  };
  res.locals.Increment = (arg) => {
    return arg===0 ? 'One' : arg===1 ? 'Two' : arg===2 ? 'Three' : arg===3 ? 'Four' : ''
  }

  res.locals.Link = handleLinkresolver

  next();
});

// default requirements for every route
const handleDataReq = async client => {
  const meta = await client.getSingle('metad')
  const preloader = await client.getSingle('preloader')
  const navigation = await client.getSingle('navigation')

  return {
    meta,
    navigation,
    preloader
  }
}

// home route ------------------------------------------
app.get('/', async (req, res) => {
  const requirements = await handleDataReq(client)
  const home = await client.getSingle('home')
  const { results: collections } = await client.get({
    predicates: prismic.predicate.at('document.type', 'collection')
  })

  res.render('pages/home', {
    ...requirements,
    collections,
    home
  });

});
// --------------------------------------------------
// --------------------------------------------------


// about route --------------------------------------
app.get('/about', async (req, res) => {
  const requirements = await handleDataReq(client)
  const about = await client.getSingle('abou')

  res.render('pages/about', {
    ...requirements,
    about
  });

});
// ---------------------------------------------------
// ---------------------------------------------------


// collections --------------------------------------
app.get('/collections', async (req, res) => {
  const requirements = await handleDataReq(client)
  const home = await client.getSingle('home')
  const { results: collections } = await client.get({
    predicates: prismic.predicate.at('document.type', 'collection'),
    fetchLinks: 'product.image'
  })

  res.render('pages/collections', {
    ...requirements,
    collections,
    home
  });

});
// ---------------------------------------------------
// ---------------------------------------------------



// detaile route -----------------------------------
app.get('/details/:uid', async (req, res) => {
  const requirements = await handleDataReq(client)
  const product = await client.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })

  res.render('pages/details', {
    ...requirements,
    product
  });

});
// ---------------------------------------------------
// ---------------------------------------------------


// local port listening
app.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
});



