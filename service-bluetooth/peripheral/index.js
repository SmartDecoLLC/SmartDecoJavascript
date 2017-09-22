'use strict'

const bleno              = require('bleno')
const AccessPointService = require('./service-ap')


const myName = 'smartdeco-setup'
process.env.BLENO_DEVICE_NAME = myName

const apService = new AccessPointService()

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state)
  if (state === 'poweredOn') {
    bleno.startAdvertising(myName, [ apService.uuid ])
  }
  else {
    bleno.stopAdvertising()
  }
})

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' +
    (error ? 'error ' + error : 'success')
  )
  if (!error) {
    bleno.setServices([
      apService
    ])
  }
})

bleno.on('mtuChange', function(mtu) {
  console.log('on -> mtuChange: ' + mtu)
})
