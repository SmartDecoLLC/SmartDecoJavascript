'use strict'

const Detector = require('snowboy').Detector
const Models   = require('snowboy').Models
const Speaker  = require('speaker')
const STT      = require('watson-developer-cloud/speech-to-text/v1')
const chatflow = require('./lib/send-to-chatflow')
const dotenv   = require('dotenv').config()
const fs       = require('fs')
const https    = require('https')
const record   = require('node-record-lpcm16')
const state    = require('./lib/finite-state-machine')
const ttsAudio = require('./lib/get-polly-tts-url')


function idleState() {
  const models = new Models()

  models.add({
    file: __dirname + '/resources/Pumpkin.pmdl',
    sensitivity: '0.5',
    hotwords : 'pumpkin'
  })

  const detector = new Detector({
    resource: __dirname + '/resources/common.res',
    models: models,
    audioGain: 2.0
  })

  /*
  detector.on('error', function (er) {
    console.log('snowboy error', er)
  })
  */

  detector.on('hotword', async function(index, hotword) {
    //fs.createReadStream(__dirname + '/resources/1.wav').pipe(speaker)
    console.log('hotword', index, hotword)

    fsm.setState('LISTENING')
  })

  let enter = function() {
    mic.pipe(detector)
  }

  let exit = function() {
    mic.unpipe()
  }

  return Object.freeze({ enter, exit })
}


function startingState() {
  let enter = function() {
    const ttsURL = ttsAudio('Hello Ted. Say "pumpkin" to interact with me.')

    // get TTS audio and pipe to speaker
    https.get(ttsURL, function(res) {
      const speaker = new Speaker({
        channels: 1,          // 2 channels 
        bitDepth: 16,         // 16-bit samples 
        sampleRate: 16000,
        signed: true
      })
      res.pipe(speaker)

      speaker.on('close', function() {
        fsm.setState('IDLE')
      })
    })
  }

  let exit = function() {

  }

  return Object.freeze({ enter, exit })
}


function listeningState() {
  let enter = function() {
    const ttsURL = ttsAudio('I am listening...')

    // get TTS audio and pipe to speaker
    https.get(ttsURL, function(res) {
      const speaker = new Speaker({
        channels: 1,          // 2 channels 
        bitDepth: 16,         // 16-bit samples 
        sampleRate: 16000,
        signed: true
      })
      res.pipe(speaker)

      speaker.on('close', function() {
        fsm.setState('RECORDING')
      })

    })
  }

  let exit = function() {

  }

  return Object.freeze({ enter, exit })
}


function recordingState() {
  let recognizerStream, text

  const speech_to_text = new STT({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD
  })

  let enter = function() {
    text = ''
    recognizerStream = speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=16000', continuous: true, inactivity_timeout: 1 })

    recognizerStream.on('error', function(event) {
      //console.log('er', event)
    })

    recognizerStream.on('close', async function(event) {
      console.log('\nWatson speech socket closed')

      try {
        console.log('sending text to chatflow:', text)
        const body = await chatflow(text)
        console.log('got chatflow response', body.response)
        const ttsURL = ttsAudio(body.response)

        // get TTS audio and pipe to speaker
        https.get(ttsURL, function(res) {

          const speaker = new Speaker({
            channels: 1,          // 2 channels 
            bitDepth: 16,         // 16-bit samples 
            sampleRate: 16000,
            signed: true
          })
          res.pipe(speaker)

          speaker.on('close', function() {
            fsm.setState('IDLE')
          })
        })
      } catch(err) {
        console.error(err)
        fsm.setState('IDLE')
      }
    })
    
    recognizerStream.on('data', function(data) {
      text += data.toString()
      console.log('watson stt results:', data.toString())
    })

    mic.pipe(recognizerStream)
    //mic.pipe(recognizerStream).pipe(process.stdout)
  }

  let exit = function() {
    mic.unpipe()
    recognizerStream = undefined
  }

  return Object.freeze({ enter, exit })
}


const mic = record.start({
  threshold: 0,
  verbose: false
})

const fsm = state()
fsm.addState('STARTING', startingState())
fsm.addState('IDLE', idleState())
fsm.addState('LISTENING', listeningState())
fsm.addState('RECORDING', recordingState())

fsm.setState('STARTING')
