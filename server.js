const express = require('express')
const axios = require('axios')
const app = express()
const osmosis = require('osmosis')

app.get('/', (req, res) => {
	res.send('Welcome to the Dionysus API!')
})
//
app.get('/movie/:title/:year', (req, res) => {
	let sources = []
	osmosis
		.get(
			`http://www.mydarewatch.com/watchm/${req.params.title.replace(
				/\s+/g,
				'-'
			)}-${req.params.year}`
		)
		.find('.open_video_btn li:nth-of-type(2) a')
		.follow('@href')
		.find('iframe@src')
		.set('source')
		.log(console.log)
		.data(function(data) {
			// Check for dead links
			axios
				.get(data.source)
				.then(res => {
					if (
						res.data.includes('h3') /* Openload error */ ||
						res.data.includes('h1') /* Streamango error */
					) {
						// Dead link
					} else {
						// Alive link
						sources.push(data.source)
					}
				})
				.catch(error => {
					console.log(error)
				})
		})
		.done(() => {
			console.log()
			res.json({ sources: sources })
		})
})

app.listen(3000, () => console.log('Dionysus API listening on port 3000 <3'))
