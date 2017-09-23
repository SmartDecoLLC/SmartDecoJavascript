'use strict'

const bleno   = require('bleno')
const list    = require('./characteristic-list')
const setSSID = require('./characteristic-ssid')
const setPass = require('./characteristic-pwd')
const status  = require('./characteristic-status')
const util    = require('util')


function AccessPointService() {
  bleno.PrimaryService.call(this, {
    uuid: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    characteristics: [
      new list(),
      new setSSID(),
      new setPass(),
      new status()
    ]
  })
}

util.inherits(AccessPointService, bleno.PrimaryService)
module.exports = AccessPointService
