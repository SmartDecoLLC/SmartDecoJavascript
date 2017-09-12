instructions on how to set up a raspberry pi as a hotspot/appliance

install raspbian lite (latest version)

```bash
sudo raspi-config
```

* enable ssh login
* under internationalization options, set locale to `en_us`
* choose generic 101 key keyboard.

save changes and exit to command prompt.

```bash
sudo reboot
```


```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs haveged hostapd isc-dhcp-server git
```


Set up a DHCP server. `sudo nano /etc/dhcp/dhcpd.conf` and add the following lines:

```bash
subnet 10.10.0.0 netmask 255.255.255.0 {
range 10.10.0.25 10.10.0.50;
option domain-name-servers 8.8.4.4;
option routers 10.10.0.1;
interface wlan0;
}
```

save and exit.


To bring up wlan0 at boot, add the following to `/etc/network/interfaces`

```bash
auto wlan0
iface wlan0 inet static
address 10.10.0.1
netmask 255.255.255.0
```


add a config file for hostapd:

`sudo nano /etc/hostapd/hostapd.conf`

fill it with:
```bash
interface=wlan0
ssid=smartdeco
hw_mode=g
channel=11
wpa=1
wpa_passphrase=
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP CCMP
wpa_ptk_rekey=600
macaddr_acl=0
```

start the access point by running `hostapd -d /etc/hostapd/hostapd.conf`

You'll now see `smartdeco` in the wifi access point list in any local wireless devices :)

To start hostapd automatically, add the command to `/etc/rc.local`, just before `exit 0`:

```bash
sudo hostapd -B /etc/hostapd/hostapd.conf
```

`-B` is for running in the background, as a daemon. Messages are logged in `/var/log/syslog`.

now check out the smartdeco code from git, and follow all of the instructions in INSTALL.md

run `./install.sh`

You then browse to http://10.10.0.1:5000 on the machine that will display the game.

Phone clients should browse to http://10.10.0.1:5001 to play the game