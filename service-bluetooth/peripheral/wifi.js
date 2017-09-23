'use strict'

const exec  = require('child_process').exec
const fs     = require('fs')
const iwlist = require('./iw')
const pubsub = require('ev-pubsub')


async function writeInterfaceConfig(essid, password) {
  const interfaces = `#auto lo

#iface lo inet loopback
#iface eth0 inet dhcp

#allow-hotplug wlan0
auto wlan0

iface wlan0 inet dhcp
#        wpa-ssid "${essid}"
#        wpa-psk "${password}"`

  return new Promise(function(resolve, reject) {
    fs.writeFile('/etc/network/interfaces', interfaces, function(er) {
      if(er)
        return reject(er)
      resolve()
    })
  })
}


async function writeWifiWPAConfig(essid, password) {
  const wpa = `country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
  ssid="${essid}"
  psk="${password}"
}
`

  return new Promise(function(resolve, reject) {
    fs.writeFile('/etc/wpa_supplicant/wpa_supplicant.conf', wpa, function(er) {
      if(er)
        return reject(er)
      resolve()
    })
  })
}

async function ex(cmd) {
  return new Promise(function(resolve, reject) {
    exec(cmd, function(er, stdout, stderr) {
      if(er) {
        console.log('error:', er)
        resolve(false)
      }
      else {
        resolve(true)
      }
    })
  })
}

// return true on successful connect
async function attemptWifi(iw, essid, password) {
  await writeInterfaceConfig(essid, password)
  await writeWifiWPAConfig(essid, password)

  //console.log('restarting wpa_supplicant')
  //await ex('sudo systemctl restart wpa_supplicant')
  //await ex('sudo ifdown wlan0')
  //await ex('sudo ifup wlan0')

  //await ex('sudo dhclient wlan0')

  // sudo service networking restart
  /*
  let r
  //console.log('restarting network')
  //r = await ex('sudo systemctl restart networking')
  await ex('sudo systemctl restart wpa_supplicant')

  console.log('linking')
  await ex('sudo iw wlan0 link')

  console.log('getting lease from dhcp server')
  await ex('sudo dhclient wlan0')

  //dhclient -r wlan0
  // request IP address:
  //dhclient wlan0
  */

  // service networking restart

  const start = Date.now()

  console.log('checking online status')

  // try to connect for up to 10 seconds
  while(Date.now() - start < 10000) {
    if (await iw.isOnline())
      return true
  }

  return false
}

// encapsulates the wifi connection
function wifi() {
  const { publish, subscribe, unsubscribe } = pubsub()
  let mode  // scanning | connecting | connected

  const iw = iwlist()

  const credentials = {
    essid: {
      value: undefined,
      timeSet: undefined
    },
    password: {
      value: undefined,
      timeSet: undefined
    },
    timeSent: undefined   // when both essid & password were last set
  }

  const getRandomAP = function() {
    // randomly select an essid from the list
    const keys = Object.keys(iw.aps)
    const idx = Math.floor(Math.random() * keys.length)
    return iw.aps[keys[idx]].essid
  }

  const scan = function() {
    if(mode === 'scanning')
      return

    credentials.essid.value = undefined
    credentials.password.value = undefined
    credentials.timeSent = undefined
    mode = 'scanning'
    iw.start()
  }

  const setSSID = function(ssid) {
    credentials.essid.value = ssid
    credentials.essid.timeSet = Date.now()
    _checkCredentials()
  }

  const setPassword = function(password) {
    credentials.password.value = password
    credentials.password.timeSet = Date.now()
    _checkCredentials()
  }

  const _attemptConnect = async function() {
    if(mode === 'connecting')
      return

    mode = 'connecting'
    iw.stop()

    const result = await attemptWifi(iw, credentials.essid.value, credentials.password.value)

    if(result) {
      mode = 'connected'
    } else {
      scan()
    }
    console.log('wifi-connected', result)
    publish('wifi-connected', result)
  }

  const _checkCredentials = function() {
    const now = Date.now()

    if(credentials.essid.value === undefined || credentials.password.value === undefined)
      return

    if(credentials.timeSent && now - credentials.timeSent < 5000)
      return

    credentials.timeSent = Date.now()
    _attemptConnect()
  }

  scan()

  return Object.freeze({ getRandomAP, scan, setSSID, setPassword, subscribe, unsubscribe })
}

module.exports = wifi()  // singleton
