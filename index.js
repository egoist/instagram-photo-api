'use strict'
const koa = require('koa')
const app = koa()
const getPhoto = require('get-instagram-photo')
const fetch = require('node-fetch')

app.use(function * () {
  let {url} = this.request

  if (url === '/' || url.length < 6) {
    this.body = `
    
    # usage:

    GET \`/:id\` or GET \`/:url\`

    eg: \`/BGwIk0KDjBn\` or \`/https://www.instagram.com/p/BGwIk0KDjBn/\`
    
    
    `
    return
  }

  url = url.substr(1)
  url = /https?:\/\//.test(url) ? url : `https://www.instagram.com/p/${url}/`
  const api = `https://api.instagram.com/oembed/?url=${url}`
  const imageURL = yield fetch(api)
    .then(data => data.json())
    .then(data => data && data.thumbnail_url)
  if (imageURL) {
    const res = yield fetch(imageURL)
    this.type = res.headers._headers['content-type'][0]
    this.body = res.body
  } else {
    this.body = 'not found'
  }
})

app.listen(4040, () => {
  console.log('http://localhost:4040')
})