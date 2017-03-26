'use strict'

const Detector = require('snowboy').Detector
const Models   = require('snowboy').Models
const Polly    = require('aws-sdk/clients/polly').Presigner
const Speaker  = require('speaker')
const STT      = require('watson-developer-cloud/speech-to-text/v1')
const dotenv   = require('dotenv').config()
const entities = require('entities')
const fs       = require('fs')
const record   = require('node-record-lpcm16')
const request  = require('request')
const state    = require('./lib/finite-state-machine')


const opts = {
  format: 'pcm',
  region: 'us-east-1',
  text: 'Ready.',
  voice: 'Brian',
  sampleRate: 16000
}

const polly = new Polly({
  apiVersion: '2016-06-10',
  region: opts.region
})

const halfHourInSeconds = 30 * 60

// http://docs.aws.amazon.com/polly/latest/dg/API_SynthesizeSpeech.html
// pcm is in signed 16-bit, 1 channel (mono), little-endian format
// https://github.com/aws/aws-sdk-js/blob/master/clients/polly.d.ts#L237
const url = polly.getSynthesizeSpeechUrl({
  OutputFormat: opts.format,

  // Valid values for pcm are "8000" and "16000" The default value is "16000"
  SampleRate: opts.sampleRate.toString(),

  Text: opts.text,
  VoiceId: opts.voice
}, halfHourInSeconds)

const speech_to_text = new STT({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD
})

const models = new Models()

/*
models.add({
  file: __dirname + '/smartdeco-pumpkin.pmdl',
  sensitivity: '0.5',
  hotwords : 'pumpkin'
})

models.add({
  file: __dirname + '/smartdeco-jabbering-jack.pmdl',
  sensitivity: '0.5',
  hotwords : 'jabbering-jack'
})
*/

const detector = new Detector({
  resource: 'resources/common.res',
  models: models,
  audioGain: 2.0
})

detector.on('hotword', function (index, hotword) {
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



async function sendDialogToChatflow(text) {
  // don't send empty text to the dialog service
  if (!text) return Promise.resolve()

  // Chatflow for "jokes" at the following POST URL:
  const url = 'https://chatflow.kitt.ai/users/589a66c40aef320100506cca/apps/610f31da.d2024/api/jokes?token=atJ7IYNV3ac1kafSpJ'

  const options = { url, json: true, body: { utterance: text.toLowerCase() } }

  /*
  from Ted:
  This chatflow returns a header that includes "pumpkinStatus", but it doesn't need to look for stories to record
  or anything that complicated. It simply needs to call back Chatflow as the Boswell interview page does.
  */
  return new Promise(function(resolve, reject) {
    request.post(options, function(err, res, body) {
      console.log('typeof body:', typeof body, 'contents:', body)
      if (err) {
        return reject(err)
      }

      if (res.statusCode >= 500) {
        return reject(`chatflow service unavailable, statusCode: ${res.statusCode}`)
      }

      if (body) {
        body.response = entities.decodeHTML(body.response)
      } else {
        console.error('no text returned from dialog service in response to', text)
      }

      resolve(body)
    })
  })
}


// TODO: set up application states
const fsm = state()
//fsm.addState('IDLE', idleState())

mic.pipe(detector)
