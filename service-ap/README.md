## service-ap

protoype of access point code. Handles setting up an access point that you can connect to, and providing a configuration
user interface to connect to internet wifi.


super fancy UI mockup:
```
+---------------------------+
|   SmartDeco Wifi Setup    |
|                           |
|     choose network:       |
|                           |
| +-----------------------+ |
| |  SmartDeco-Setup-EC18 | |
| |                       | |
| |  Kim's House          | |
| |                       | |
| |  TV Bro's Palace      | |
| |                       | |
| |  Arthur's Study       | |
| |                       | |
| |  Ted's secret hideout | |
| +-----------------------+ |
|                           |
| +-----------------------+ |
| |       CONNECT         | |
| +-----------------------+ |
+---------------------------+
```

on clicking `CONNECT`:
* disable connect button
* if the ap is password protected first show the password dialog.
* If the ap is not password protected or when the password dialog is submitted:
  * display page saying "please wait while we attempt to connect your pumpkin to the wifi"
  * generate an id
  * send ap and id to backend

this might be a great candidate for implementing a service worker.
on supported platforms it'd enable offline support