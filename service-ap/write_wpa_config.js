'use strict'

const dotenv = require('dotenv').config()
const fs     = require('fs')


const wpa = `country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
  ssid="${process.env.SSID}"
  psk="${process.env.PSK}"
}`

fs.writeFileSync('/etc/wpa_supplicant/wpa_supplicant-wlan0.conf', wpa, 'utf8')
