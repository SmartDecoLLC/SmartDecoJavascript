install newest version of raspbian lite

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
wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-armv6l.tar.xz
tar xvf node-v8.9.4-linux-armv6l.tar.xz
cd node-v8.9.4-linux-armv6l/
sudo cp -R bin/* /usr/bin/
sudo cp -R lib/* /usr/lib/

sudo apt-get install -y nodejs bluetooth bluez libbluetooth-dev libudev-dev

sudo systemctl stop bluetooth
sudo systemctl disable bluetooth

# enable smartdeco service to run at boot
sudo cp smartdeco-bt.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable smartdeco-bt.service
sudo systemctl start smartdeco-bt.service
```
