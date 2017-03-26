'use strict'

const Detector = require('snowboy').Detector
const Models   = require('snowboy').Models
const Speaker  = require('speaker')
const STT      = require('watson-developer-cloud/speech-to-text/v1')
const chatflow = require('./lib/send-to-chatflow')
const dotenv   = require('dotenv').config()
const entities = require('entities')
const fs       = require('fs')
const https    = require('https')
const record   = require('node-record-lpcm16')
const state    = require('./lib/finite-state-machine')
const ttsAudio = require('./lib/get-polly-tts-url')


const speech_to_text = new STT({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD
})

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

detector.on('hotword', async function (index, hotword) {
  //fs.createReadStream(__dirname + '/resources/1.wav').pipe(speaker)

  console.log('hotword', index, hotword)

  /*
  const recognizerStream = speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=16000', continuous: true, inactivity_timeout: 1, interim_results: false })

  recognizerStream.on('error', function(event) {
    console.log('er', event)
  })

  recognizerStream.on('close', function(event) {
    console.log('watson speech socket closed')
  })

  recognizerStream.on('data', function(data) {
    let failed = processInput(data.toString())
    if (failed) {
      recognizerStream.close()
    }
  })

  try {
    const body = await chatflow(text)
    const ttsURL = ttsAudio(body.response)

    // get TTS audio and pipe to speaker
    https.get(url, function(res) { res.pipe(speaker) }) 

  } catch(err) {
    return console.error(err)
  }

  mic.pipe(recognizerStream).pipe(process.stdout)
  */
})

const mic = record.start({
  threshold: 0,
  verbose: false
})

const speaker = new Speaker({
  channels: 2,          // 2 channels 
  bitDepth: 32,         // 16-bit samples 
  sampleRate: 44100,
  signed: true
})


// TODO: set up application states
const fsm = state()
//fsm.addState('IDLE', idleState())

mic.pipe(detector)
