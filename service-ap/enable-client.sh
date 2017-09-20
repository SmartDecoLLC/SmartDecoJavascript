#!/bin/sh

# connects to wifi client. must run this with sudo

SSID="Sonic-2630"
PSK="7efv4y6p3yk3"

# write the wireless access point to
SSID=$SSID PSK=$PSK node write_wpa_config.js

systemctl stop hostapd.service
systemctl stop isc-dhcp-server.service

rm /etc/network/interfaces

dhclient -r wlan0

systemctl start wpa_supplicant@wlan0.service

#iw wlan0 link
#https://unix.stackexchange.com/questions/92799/connecting-to-wifi-network-through-command-line
#iwconfig wlan0 essid $SSID

# request IP address:
dhclient wlan0

# TODO: detect whether wifi is connected or not
# $? contains exit code of last command
#echo "result:" $?
