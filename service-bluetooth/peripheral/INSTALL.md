install raspbian lite (newest version of Jessie)

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

login to the machine, find out it's ip address, and ssh in (a terminal in osx
will be easier to work with since you can copy/paste stuff)

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs bluetooth bluez libbluetooth-dev libudev-dev

sudo systemctl stop bluetooth
sudo systemctl disable bluetooth

# enable smartdeco service to run at boot
sudo cp smartdeco.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable smartdeco.service
sudo systemctl start smartdeco.service
```
