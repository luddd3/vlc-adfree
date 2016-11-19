#!/usr/bin/env node
'use strict'
let play = require('../')
let url = process.argv.slice(2)[0]

if (!url || url === '') {
  console.log('Please url of page where video reside')
  console.log('Example:')
  console.log('    vlc-adfree http://tv4play.se/program/bachelor-när-leken-blev-allvar?video_id=3567155')
  process.exit(0)
}

play(url, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
