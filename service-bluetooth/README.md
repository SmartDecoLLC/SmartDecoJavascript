I think it might be better to try to build a bluetooth integration first.
this will be a lot simpler than having to switch the wifi between ap and client mode.


the pi will act as a BLE peripheral device.

phones/computers will act as a BLE central device.


```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```


sudo BLENO_DEVICE_NAME=smartdeco node index.js


https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web
https://googlechrome.github.io/samples/web-bluetooth/index.html
https://github.com/strangesast/bleno
https://github.com/strangesast/bleno-web-pizza-example
https://www.uuidgenerator.net/
http://blog.fraggod.net/2015/11/28/raspberry-pi-early-boot-splash-logo-screen.html


## TODO

* peripheral: report status back to web interface
* cleanup web interface
* splash screen while booting
