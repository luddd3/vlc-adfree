'use strict'
let cp = require('child_process')
let fs = require('fs')
let os = require('os')
let path = require('path')
let request = require('request')
let vlcCommand = require('vlc-command')

let providers = {
  tv4play: require('./providers/tv4play')
}

let SUBTITLE_PATH = path.join(os.tmpdir(), 'adfree-temp-subs.srt')

let getProvider = (url) => {
  if (url.includes('tv4play')) {
    return providers.tv4play
  } else {
    throw new Error('provider not found for this url')
  }
}

let play = (data, cb) => {
  vlcCommand((err, vlcPath) => {
    if (err) return cb(new Error('vlc not found'))

    let args = [
      `--meta-title=${data.title}`,
      data.video
    ]
    // if (data.subtitles) {
    //   args.push(`--sub-file=${SUBTITLE_PATH}`)
    // }
    let child = cp.spawn(vlcPath, args, {stdio: 'ignore', detached: true}) 
    child.unref()
  })
}

module.exports = (url, cb) => {
  let provider
  try {
    provider = getProvider(url)
  } catch (e) {
    return cb(e)
  }
  provider.get(url, (err, data) => {
    if (err) {
      return cb(err)
    }
    if (data.subtitles) {
      request.get(data.subtitles).pipe(fs.createWriteStream(SUBTITLE_PATH)).on('finish', () => {
        play({
          video: data.video,
          subtitles: SUBTITLE_PATH
        })
      })
    } else {
      play({video: data.video})
    }
  })
}
