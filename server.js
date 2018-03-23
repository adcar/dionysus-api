const express = require('express')
const axios = require('axios')
const app = express()
const osmosis = require('osmosis')
const mdb = require('moviedb')('2e0bfe56b018618b270a6e0428559292')
// sort sources into JSON format based on provider name (doesn't check for dead links)
const sortSources = require('./sortSources.js')

// CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	)
	next()
})

app.get('/', (req, res) => {
	res.send(
		'Welcome to the Dionysus API!<br /> <a href="https://dionysus.docs.apiary.io">Read the docs!</a>'
	)
})
// This is a fallback in case the user doesn't include a year. It will automatically search for the title and grab the first result's year.
app.get('/movie/:title', (req, res) => {
	mdb.searchMovie({ query: req.params.title }, (err, response) => {
		let year = response.results[0].release_date.slice(0, 4)
		res.redirect(`/movie/${req.params.title}/${year}`)
	})
})
app.get('/movie/:title/:year', (req, res) => {
	let sources = []
	osmosis
		.get(
			`http://www.mydarewatch.com/watchm/${req.params.title
				.replace(/\s+/g, '-')
				.toLowerCase()}-${req.params.year}`
		)
		.find('.watch_bottom + script[data-cfasync="false"]')
		.set('test')
		.data(function(data) {
			eval(data.test)
			embeds = embeds.sort().filter(x => x !== undefined)

			// Soooo many regex's!
			embeds = embeds.map(embed =>
				new Buffer(embed, 'base64').toString('ascii')
			)
			sources = embeds.map(embed => embed.match(/http[^"]*/gi).toString())
		})
		.done(() => {
			res.json(sortSources(sources))
		})
		.log(console.log)
		.error(console.log)
		.debug(console.log)
})

app.get('/show/:title/:season/:episode', (req, res) => {
	let sources = []
	osmosis
		.get(
			`http://www.mydarewatch.com/${req.params.title
				.replace(/\s+/g, '-')
				.toLowerCase()}/season/${req.params.season}/episode/${
				req.params.episode
			}`
		)
		.find('.watch_bottom + script[data-cfasync="false"]')
		.set('test')
		.data(function(data) {
			eval(data.test)
			embeds = embeds.sort().filter(x => x !== undefined)

			// Soooo many regex's!

			// Converts base64 to ascii
			embeds = embeds.map(embed =>
				new Buffer(embed, 'base64').toString('ascii')
			)

			// Grabs anything beginning with http
			sources = embeds.map(embed => embed.match(/http[^"]*/gi).toString())
			// Cleans up array (removes line breaks)
			sources = sources.filter(el => el.trim())
		})
		.done(() => {
			res.json(sortSources(sources))
		})
})
let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Dionysus API listening on port ${port} <3`))
