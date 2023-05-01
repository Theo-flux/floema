import dotenv from 'dotenv';
dotenv.config();
import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';

const accessToken = process.env.PRISMIC_ACCESS_TOKEN;
const endPoint = prismic.getRepositoryEndpoint(process.env.PRISMIC_REPO);

// const routes = [
//   {
//     type: 'home',
//     path: '/:uid'
//   },

//   {
//     type: 'detail',
//     path: '/:uid'
//   },

//   {
//     type: 'collection',
//     path: '/:uid'
//   },

//   {
//     type: 'about',
//     path: '/:uid'
//   },
// ];

export const client = prismic.createClient(endPoint, {
  accessToken,
  fetch,
});
