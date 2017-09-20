'use strict'

const fs = require('fs')


const hostapd = `interface=wlan0
ssid=${process.env.SSID}
hw_mode=g
channel=11
wpa=1
wpa_passphrase=${process.env.PSK}
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP CCMP
wpa_ptk_rekey=600
macaddr_acl=0
`

fs.writeFileSync('/etc/hostapd/hostapd.conf', hostapd, 'utf8')
