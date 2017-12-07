'use strict'

const delay = require('delay')
const exec  = require('child_process').execSync
const fs    = require('fs')


const cacheDir = __dirname + '/../service-content/cache'


async function run() {
  if(!fs.existsSync(cacheDir))
    fs.mkdirSync(cacheDir)

  while(true) {
    if(fs.existsSync(cacheDir)) {
      const files = fs.readdirSync(cacheDir)

      // play a random file
      let idx = Math.floor(Math.random() * files.length)
      exec(`omxplayer ${cacheDir}/${files[idx]} --blank`)
    }

    await delay(30000) // wait 30 seconds
  }
}

run()
