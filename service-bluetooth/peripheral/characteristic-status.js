'use strict'

const bleno = require('bleno')
const os    = require('os')
const util  = require('util')
const wifi  = require('./wifi')


// report the current wifi status (scanning, connecting, failed, connected)
const BlenoCharacteristic = bleno.Characteristic

const StatusCharacteristic = function() {
 StatusCharacteristic.super_.call(this, {
    uuid: '6e400002-b5a3-f393-e0a9-e50e24dcca9f',
    properties: [ 'notify' ]
  })
}

StatusCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('StatusCharacteristic subscribe')

  wifi.subscribe('wifi-status', function(status) {
    updateValueCallback(new Buffer(status))
  })
}

StatusCharacteristic.prototype.onUnsubscribe = function() {
  console.log('StatusCharacteristic unsubscribe')
}

util.inherits(StatusCharacteristic, BlenoCharacteristic)
module.exports = StatusCharacteristic
