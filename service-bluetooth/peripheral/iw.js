'use strict'

const iwlist = require('iwlist')

module.exports = function iw(options={}) {
  const dev = options.dev || 'wlan0'
  const frequency = options.frequency || 5000 // millis to wait between wifi scans
  const iw = iwlist(dev)

  // key is mac address, value is access point object
  const aps = {}
  let _poll

  const _scan = async function() {
    return new Promise(function(resolve, reject) {
      iw.scan(function(er, items) {
        if (er)
          return reject(er)

        const lastFound = Date.now()
        items.forEach(function(ap) {
          ap.lastFound = lastFound
          if(ap.essid && ap.essid.trim().length)
            aps[ap.address] = ap
        })

        _cleanStaleAps()
        resolve(aps)
      })
    })
  }

  const start = function() {
    if(!_poll)
      _poll = setInterval(_scan, frequency)
  }

  const stop = function() {
    if(!_poll)
      return

    clearInterval(_poll)
    _poll = undefined
  }

  const _cleanStaleAps = function() {
    const now = Date.now()
    // TODO: remove old ips that we haven't seen in a while from the object
  }

  return Object.freeze({ aps, start, stop })
}