'use strict'

const bleno = require('bleno')
const os    = require('os')
const util  = require('util')
const wifi  = require('./wifi')


// list the access points that are currently visible
const BlenoCharacteristic = bleno.Characteristic

const ListCharacteristic = function() {
 ListCharacteristic.super_.call(this, {
    uuid: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    properties: [ 'notify' ]
  })
}

ListCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('NotifyOnlyCharacteristic subscribe')

  this.changeInterval = setInterval(function() {
    //const data = new Buffer(4)
    //data.writeUInt32LE(this.counter, 0)
    const data = new Buffer(wifi.getRandomAP())
    updateValueCallback(data)
  }.bind(this), 100)
}

ListCharacteristic.prototype.onUnsubscribe = function() {
  console.log('NotifyOnlyCharacteristic unsubscribe')
  if (this.changeInterval) {
    clearInterval(this.changeInterval)
    this.changeInterval = undefined
  }
}

util.inherits(ListCharacteristic, BlenoCharacteristic)
module.exports = ListCharacteristic
