'use strict'

const bleno = require('bleno')
const list = require('./characteristic-list')
const util = require('util')


function AccessPointService() {
  bleno.PrimaryService.call(this, {
    uuid: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    //uuid: 'ef19fc8b-ae48-4b51-9d8b-c5da9093eaa7',
    //uuid: 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb07',
    characteristics: [
      new list()
    ]
  })
}

util.inherits(AccessPointService, bleno.PrimaryService)
module.exports = AccessPointService
