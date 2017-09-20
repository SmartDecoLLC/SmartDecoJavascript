#!/bin/sh

# sets up the host as a wifi access point

SSID="SmartDeco-Setup"
PSK="smartdeco"

systemctl stop wpa_supplicant@wlan0.service

# turn off WiFi
#ifconfig wlan0 down

# release ip from dhcpd
sudo dhclient -r wlan0

#rm /etc/wpa_supplicant/wpa_supplicant-wlan0.conf

cp dhcpd.conf /etc/dhcp/
cp interfaces /etc/network/

# turn on WiFi
#ifconfig wlan0 up

# write the the hostapd config file
SSID=$SSID PSK=$PSK node write_hostapd_config.js

ifconfig wlan0 10.10.0.1

systemctl start hostapd.service
systemctl start isc-dhcp-server.service

# start the configuration web server
npm start
