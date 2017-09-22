'use strict'

const bleno  = require('bleno')
const iwlist = require('./iw')
const os     = require('os')
const util   = require('util')


const iw = iwlist()
iw.start()

// set the access point we're trying to connect to
const BlenoCharacteristic = bleno.Characteristic

const SetSSIDCharacteristic = function() {
 SetSSIDCharacteristic.super_.call(this, {
    uuid: '6e400002-b5a3-f393-e0a9-e50e24dcca80',
    properties: [ 'write' ]
  })
 this._value = new Buffer(0)
}

SetSSIDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  // TODO
  /*
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  }
  else if (data.length !== 2) {
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
  }
  else {
    var temperature = data.readUInt16BE(0);
    var self = this
    this.pizza.once('ready', function(result) {
      if (self.updateValueCallback) {
        var data = new Buffer(1);
        data.writeUInt8(result, 0);
        self.updateValueCallback(data);
      }
    })
    //this.pizza.bake(temperature);
    callback(this.RESULT_SUCCESS);
  }
  */
}


util.inherits(SetSSIDCharacteristic, BlenoCharacteristic)
module.exports = SetSSIDCharacteristic
