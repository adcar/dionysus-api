const express = require('express')
const app = express()
const osmosis = require('osmosis');

app.get('/', (req, res) => {
  res.send('Welcome to the Dionysus API!')
})
app.get('/movie/:title/:year*?', (req, res) => {
  let sources = []
if (req.params.year) {
  osmosis
  .get(`https://openloadmovie.ws/movies/${req.params.title.replace(/\s+/g, '-')}-${req.params.year}`)
  .find('noscript iframe.metaframe.rptss@src')
  .set('source')
  .data(function(listing) {
      sources.push(listing.source)
      console.log(listing.source)
      res.json(listing)
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log)
} else {
  osmosis
  .get(`https://openloadmovie.ws/movies/${req.params.title.replace(/\s+/g, '-')}`)
  .find('noscript iframe.metaframe.rptss@src')
  .set('source')
  .data(function(listing) {
      console.log(listing.source)
      res.json(listing)
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log)
  .done(console.log('all done!'))
}

})

app.listen(3000, () => console.log('Dionysus API listening on port 3000 <3'))
