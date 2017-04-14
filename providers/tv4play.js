'use strict'
let url = require('url')
let querystring = require('querystring')
let request = require('request')
let xml2js = require('xml2js')

let get = (loc, cb) => {
  let video_id = querystring.parse(url.parse(loc).query)['video_id']
  let requestUrl = `https://prima.tv4play.se/api/web/asset/${video_id}/play?protocol=hls3&videoFormat=MP4+WEBVTTS+WEBVTT`
  request.get(requestUrl, (err, res, body) => {
    if (err) {
      return cb(err)
    }
    xml2js.parseString(body, (err, obj) => {
      cb(err, extractInfo(obj))
    })
  })
}

let extractInfo = obj => {
  let title = obj.playback.title[0]
  let items = obj.playback.items.map(x => x.item)[0].map(item => {
    return { mediaFormat: item.mediaFormat[0], url: item.url[0] }
  })
  return {
    title: title,
    video: items.filter(isVideo)[0].url.replace('https://', 'http://'),
    subtitles: items.filter(isSubtitle).length > 0 &&
      items.filter(isSubtitle)[0].url
  }
}

let isVideo = x => {
  return x.mediaFormat === 'mp4'
}

let isSubtitle = x => {
  return x.mediaFormat === 'webvtt'
}

module.exports = { get }
