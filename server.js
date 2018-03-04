const express = require('express')
const axios = require('axios')
const app = express()
const osmosis = require('osmosis')

// sort sources into JSON format (doesn't check for dead links)
const sortSources = sources => {
	let sortedSources = {
		openload: [],
		streamango: [],
		vidto: [],
		vshare: [],
		estream: [],
		vidlox: [],
		vidup: [],
		vidtodo: [],
		vidzi: [],
		thevideobee: [],
		thevideo: [],
		watchers: [],
		streamplay: []
	}
	sources.forEach(source => {
		if (source.includes('openload')) {
			sortedSources.openload.push(source)
		} else if (source.includes('streamango')) {
			sortedSources.streamango.push(source)
		} else if (source.includes('vidto.me')) {
			sortedSources.vidto.push(source)
		} else if (source.includes('vshare')) {
			sortedSources.vshare.push(source)
		} else if (source.includes('estream')) {
			sortedSources.estream.push(source)
		} else if (source.includes('vidlox')) {
			sortedSources.vidlox.push(source)
		} else if (source.includes('vidup')) {
			sortedSources.vidup.push(source)
		} else if (source.includes('vidtodo')) {
			sortedSources.vidtodo.push(source)
		} else if (source.includes('vidzi')) {
			sortedSources.vidzi.push(source)
		} else if (source.includes('thevideobee')) {
			sortedSources.thevideobee.push(source)
		} else if (
			source.includes('thevideo.cc') ||
			source.includes('thevideo.me')
		) {
			sortedSources.thevideo.push(source)
		} else if (source.includes('watchers')) {
			sortedSources.watchers.push(source)
		} else if (source.includes('streamplay')) {
			sortedSources.streamplay.push(source)
		} else {
			console.log(`${source} didn't match any known sources`)
		}
	})
	return sortedSources
}
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
			sources = embeds.map(embed => embed.match(/http[^"]*/gi).toString())
		})
		.done(() => {
			res.json(sortSources(sources))
		})
})

app.get('/show/:title/:season/:episode', (req, res) => {
	let sources = []
	osmosis
		.get(
			`http://www.mydarewatch.com/${req.params.title.replace(
				/\s+/g,
				'-'
			)}/season/${req.params.season}/episode/${req.params.episode}`
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
