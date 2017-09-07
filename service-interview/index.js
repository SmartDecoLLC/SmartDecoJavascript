'use strict'

const Detector = require('snowboy').Detector
const Models   = require('snowboy').Models
const STT      = require('watson-developer-cloud/speech-to-text/v1')
const chatflow = require('./lib/send-to-chatflow')
const dotenv   = require('dotenv').config()
const record   = require('node-record-lpcm16')
const state    = require('./lib/finite-state-machine')
const tts      = require('./lib/tts')


/*
+-----------+
| STARTING  |
+----+------+
     |
 "hi Ted. Say pumpkin to
 interact with me"
     |
  +--v---+  snowboy detects    +-----------+
  | IDLE +--wake-word(s) +-----> LISTENING |
  +--^---+                     +-----+-----+
     |                               |
     |                          AWS Polly says:
     |                          "I am listening"
     |  watson STT                   |
     |  speech ended           +-----v-----+
     +--(1s silence) <---------+ RECORDING |
                               +-----------+
*/

function idleState() {
  let mic
  const models = new Models()

  models.add({
    file: __dirname + '/resources/Pumpkin.pmdl',

    // Detection sensitivity controls how sensitive the detection is.
    // It is a value between 0 and 1. Increasing the sensitivity value
    // leads to better detection rate, but also higher false alarm rate.
    // It is an important parameter that you should play with in your
    // actual application.
    sensitivity: '0.4',
    hotwords : 'pumpkin'
  })

  const detector = new Detector({
    resource: __dirname + '/resources/common.res',
    models: models,

    // audioGain controls whether to increase (>1) or decrease (<1) input volume.
    audioGain: 2.0
  })

  detector.on('error', function (er) {
    console.log('snowboy error', er)
  })

  detector.on('hotword', async function(index, hotword) {
    console.log('hotword', index, hotword)
    fsm.setState('LISTENING')
  })

  let enter = function() {
    mic = record.start({
      threshold: 0,
      verbose: false
    })

    mic.pipe(detector)
  }

  let exit = function() {
    record.stop()
    mic.unpipe(detector)
  }

  return Object.freeze({ enter, exit })
}


function startingState() {
  let enter = async function() {
    await tts('Hi there Ted. Say "pumpkin" to interact with me.')
    fsm.setState('IDLE')
  }

  let exit = function() { }

  return Object.freeze({ enter, exit })
}


function listeningState() {
  let enter = async function() {
    await tts('I am listening...')
    fsm.setState('RECORDING')
  }

  let exit = function() {

  }

  return Object.freeze({ enter, exit })
}


function recordingState() {
  let recognizerStream, text, mic

  const speech_to_text = new STT({
    username: process.env.WATSON_SPEECH_TO_TEXT_USERNAME,
    password: process.env.WATSON_SPEECH_TO_TEXT_PASSWORD
  })

  let enter = async function() {
    mic = record.start({
      threshold: 0,
      verbose: false
    })

    text = ''
    recognizerStream = speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=16000', inactivity_timeout: 1 })

    recognizerStream.on('error', function(event) {
      //console.log('er', event)
    })

    recognizerStream.on('close', async function(event) {
      console.log('\nWatson speech socket closed')

      if (text) {
        try {
          console.log('sending to chatflow:', text)
          const body = await chatflow(text)
          console.log('chatflow response:', body)
          await tts(body.response)
        } catch(err) {
          console.error(err)
        }
      }

      fsm.setState('IDLE')
    })

    recognizerStream.on('data', function(data) {
      text += data.toString()
      //console.log('watson stt results:', data.toString())
    })

    mic.pipe(recognizerStream)
  }

  let exit = function() {
    record.stop()
    mic.unpipe(recognizerStream)
    recognizerStream = undefined
  }

  return Object.freeze({ enter, exit })
}


const fsm = state()
fsm.addState('STARTING', startingState())
fsm.addState('IDLE', idleState())
fsm.addState('LISTENING', listeningState())
fsm.addState('RECORDING', recordingState())

fsm.setState('STARTING')
