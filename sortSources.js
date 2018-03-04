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
module.exports = sortSources
