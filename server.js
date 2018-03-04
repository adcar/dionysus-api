const express = require('express')
const axios = require('axios')
const app = express()
const osmosis = require('osmosis')
const cheerio = require('cheerio')

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
	res.send('Welcome to the Dionysus API!')
})

app.get('/movie/:title/:year', (req, res) => {
	let sources = []
	osmosis
		.get(
			`http://www.mydarewatch.com/watchm/${req.params.title.replace(
				/\s+/g,
				'-'
			)}-${req.params.year}`
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
			sources = embeds.map(embed =>
				embed.match(/http[^"]*/gi).toString()
			)

		})
		.done(() => {
			res.json(sources)
		})
})

app.get('/show/:title/:season/:episode', (req, res) => {
	let sources = []
	osmosis
		.get(
			`http://www.mydarewatch.com/${req.params.title.replace(/\s+/g, '-')}/season/${req.params.season}/episode/${req.params.episode}`
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
			sources = embeds.map(embed =>
				embed.match(/http[^"]*/gi).toString()
			)

		})
		.done(() => {
			res.json(sources)
		})
})
let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Dionysus API listening on port ${port} <3`))
