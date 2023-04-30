// The backend of the whole app
import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import * as prismicH from '@prismicio/helpers'
import { client } from './config/prismicConfig.js'

const app = express()
const port = 3000

app.set('views')
app.set('view engine', 'pug')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, 'views')))

app.use((req, res, next) => {
    res.locals.ctx = {
      prismicH,
    }
    next()
  })

app.get('/', (req, res) => {
    res.render('pages/home')
})

app.get('/about', async (req, res) => {
    const doc = await client.getSingle('abou')
    console.log(doc)
    res.render('pages/about')
})

app.get('/collections', (req, res) => {
    res.render('pages/collections')
})

app.get('/details', (req, res) => {
    res.render('pages/details')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 