instructions on how to set up a raspberry pi as a hotspot/appliance

install raspbian lite (latest version)

```bash
sudo raspi-config
```

TODO: look at raspi-config source and figure out how to do these from the command line
https://github.com/RPi-Distro/raspi-config/blob/master/raspi-config

* enable ssh login
* auto login as raspberry pi user
* under internationalization options, set locale to `en_us`
* choose generic 101 key keyboard.

save changes and exit to command prompt.

plug in an ethernet cable.

```bash
sudo reboot
```

login to the machine, find out it's ip address, and ssh in (a terminal in osx
will be easier to work with since you can copy/paste stuff)

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs haveged hostapd isc-dhcp-server git

# ensure dhcp server is bound to wlan0 interface
sudo cp isc-dhcp-server-default /etc/default/isc-dhcp-server

# prevent the services from running automatically on boot
sudo systemctl disable hostapd
sudo systemctl disable isc-dhcp-server
sudo systemctl disable wpa_supplicant@wlan0

sudo cp hostapd.conf-default /etc/default/hostapd
```


running in hostap mode:
```bash
sudo ./enable-master.sh
```
You'll now see `smartdeco` in the wifi access point list in any local wireless devices :)
You then browse to http://10.10.0.1 on the machine that will display the setup page.


running in wireless client mode:
```bash
sudo ./enable-client.sh
```


### references

https://www.digikey.com/en/maker/blogs/raspberry-pi-3-how-to-configure-wi-fi-and-bluetooth/03fcd2a252914350938d8c5471cf3b63

scan and connect to wifi:  https://www.npmjs.com/package/iwlist

https://learn.adafruit.com/setting-up-a-raspberry-pi-as-a-wifi-access-point/install-software

https://askubuntu.com/questions/795226/how-to-list-all-enabled-services-from-systemctl

https://raspberrypi.stackexchange.com/questions/44184/switch-between-ap-and-client-mode

https://askubuntu.com/questions/140126/how-do-i-install-and-configure-a-dhcp-server
