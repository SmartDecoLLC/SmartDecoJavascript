'use strict'

const request = require('request')


module.exports = async function sendToChatflow(text) {
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
