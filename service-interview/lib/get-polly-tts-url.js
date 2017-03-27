'use strict'

const Polly        = require('aws-sdk/clients/polly').Presigner
const getVoiceName = require('./get-voice-name')


/*
const opts = {
  format: 'pcm',
  region: 'us-east-1',
  text: 'Ready.',
  voice: 'Brian',
  sampleRate: 16000
}
*/

const polly = new Polly({
  apiVersion: '2016-06-10',
  region: process.env.AWS_REGION
})

module.exports = function getPollyTTSURL(text) {
  const halfHourInSeconds = 30 * 60
  const pollyVoice = getVoiceName()

  // http://docs.aws.amazon.com/polly/latest/dg/API_SynthesizeSpeech.html

  // pcm is in signed 16-bit, 1 channel (mono), little-endian format
  // https://github.com/aws/aws-sdk-js/blob/master/clients/polly.d.ts#L237
  return polly.getSynthesizeSpeechUrl({
    OutputFormat: 'pcm', // mp3, pcm

    // Valid values for pcm are "8000" and "16000" The default value is "16000"
    // 22050 for mp3
    SampleRate: '16000',

    Text: text,
    VoiceId: pollyVoice
  }, halfHourInSeconds)
}
