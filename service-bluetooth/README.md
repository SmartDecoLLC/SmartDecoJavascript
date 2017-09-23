the pi acts as a BLE peripheral device.

phones/computers will act as a BLE central device.

```
|- peripheral/
`- web/
```

* `peripheral/` the bluetooth peripheral server that is hosted on the pi
* `web/` the bt.smartdeco.ai website, which provides the user interface to pair smartdeco over bluetooth

https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web
https://googlechrome.github.io/samples/web-bluetooth/index.html
https://github.com/strangesast/bleno
https://github.com/strangesast/bleno-web-pizza-example
https://www.uuidgenerator.net/
http://blog.fraggod.net/2015/11/28/raspberry-pi-early-boot-splash-logo-screen.html


## TODO

* cleanup web interface
* splash screen while booting
* choose a custom name when setting up the bluetooth server (e.g., smartdeco-setup-19E)
* change ssl login to use pem cert
