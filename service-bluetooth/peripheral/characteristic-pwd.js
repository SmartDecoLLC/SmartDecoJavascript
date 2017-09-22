'use strict'

const bleno = require('bleno')
const os    = require('os')
const util  = require('util')


// set the password of the access point we're connecting to
const BlenoCharacteristic = bleno.Characteristic

const SetPasswordCharacteristic = function() {
 SetPasswordCharacteristic.super_.call(this, {
    uuid: '6e400002-b5a3-f393-e0a9-e50e24dcca81',
    properties: [ 'write' ]
  })
}

SetPasswordCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data.toString()
  console.log('setPass:', this._value)
  callback(this.RESULT_SUCCESS)
}

util.inherits(SetPasswordCharacteristic, BlenoCharacteristic)
module.exports = SetPasswordCharacteristic
