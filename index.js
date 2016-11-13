'use strict'
let cp = require('child_process')
let vlcCommand = require('vlc-command')
let fs = require('fs')
let request = require('request')
let providers = {
  tv4play: require('./providers/tv4play')
}

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

    const args = [
      // '--play-and-exit',
      // '--video-on-top',
      // '--quiet',
      `--meta-title=${data.title}`,
      data.video
    ]
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
      cb(err)
    }
    play({video: data.video})
  })
}
