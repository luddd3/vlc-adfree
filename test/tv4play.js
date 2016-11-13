'use strict'
let util = require('util')
let tap = require('tap')
let tv4play = require('../providers/tv4play')

tap.test('Get video url', (test) => {
  let reqUrl = 'http://wwww.tv4play.se/program/bachelor-när-leken-blev-allvar?video_id=3567155'
  tv4play.get(reqUrl, (err, results) => {
    if (err) {
      throw err
    }
    test.match(results.title, 'Bachelor - Tjejerna avslöjar allt del 6')
    test.match(results.subtitles, 'http://iosv.tv4play.se/subs/2016-11-03/vid_3567155/vid_3567155.webvtt?')
    test.match(results.video, 'http://tv4play-i.akamaihd.net/i/mp4root/2016-10-12/pid200014763(3567155_,T3MP445,T3MP435,T3MP425,T3MP415,T3MP48,T3MP43,T3MP4130,).mp4.csmil/master.m3u8')
    test.end()
  })
})
