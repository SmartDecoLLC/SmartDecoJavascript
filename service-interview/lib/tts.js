'use strict'

const Speaker = require('speaker')
const https   = require('https')
const tts     = require('tts-polly')


module.exports = async function tts(text) {
  const [ audioURL, speechMarks ] = await tts(text, 'pcm')

  return new Promise(function(resolve, reject) {
    https.get(audioURL, function(res) {
      const speaker = new Speaker({
        channels: 1,          // 2 channels
        bitDepth: 16,         // 16-bit samples
        sampleRate: 16000,
        signed: true
      })

      speaker.on('close', function() {
        resolve()
      })

      res.pipe(speaker)
    })
  })
}
