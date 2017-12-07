'use strict'

const delay = require('delay')
const fetch = require('node-fetch')


async function run() {
  while(true) {
    let response = await fetch('https://s3.amazonaws.com/smartdecovideos/smartdecoPlaylist.txt')
    let text = await response.text()
    console.log('text:', text)
    await delay(10000)
  }
}

run()
