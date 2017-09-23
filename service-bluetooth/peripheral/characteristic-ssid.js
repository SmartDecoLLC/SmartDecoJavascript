'use strict'

const bleno = require('bleno')
const os    = require('os')
const util  = require('util')
const wifi  = require('./wifi')


// set the access point SSID we're connecting to
const BlenoCharacteristic = bleno.Characteristic

const SetSSIDCharacteristic = function() {
 SetSSIDCharacteristic.super_.call(this, {
    uuid: '6e400002-b5a3-f393-e0a9-e50e24dcca80',
    properties: [ 'write' ]
  })
}

SetSSIDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  wifi.setSSID(data.toString())
  callback(this.RESULT_SUCCESS)
}


util.inherits(SetSSIDCharacteristic, BlenoCharacteristic)
module.exports = SetSSIDCharacteristic
