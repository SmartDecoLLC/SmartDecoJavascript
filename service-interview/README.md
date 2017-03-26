#service-interview

a voice interaction agent based on Snowboy for wakeword detection, IBM Watson for speech-to-text, 
and Amazon Polly for text-to-speech.

```
|- resources/
|- *.pmdl
|- index.js
|- install.sh
`- smartdeco.service
```

* `resources/` stuff needed by snowboy
* `*.pmdl` snowboy models for wakeword detection
* `home-automation.service` systemd install script
* `index.js` the entry point for the interaction agent
* `INSTALL.md` install instructions
* `install.sh` linux shell script to install dependencies


## installation

```bash
./install.sh
```
