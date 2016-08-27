'use strict'
const koa = require('koa')
const app = koa()
const getPhoto = require('get-instagram-photo')

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

  try {
    if (/https?:\/\//.test(url)) {
      this.body = {
        url: yield getPhoto(url)
      }
    } else {
      this.body = {
        url: yield getPhoto(`https://www.instagram.com/p/${url}/`)
      }
    }
  } catch (e) {
    this.body = e.message
  }
})

app.listen(4040, () => {
  console.log('http://localhost:4040')
})