'use strict'

const delay = require('delay')
const exec  = require('child_process').execSync
const fetch = require('node-fetch')
const fs    = require('fs')


const cacheDir = __dirname + '/cache'


async function getCacheEntries() {
  let response = await fetch('https://s3.amazonaws.com/smartdecovideos/smartdecoPlaylist.txt')
  let text = await response.text()
  let entries = text.split('\n')
  return entries
}


async function cacheNewEntries(entries) {
  for(let i=0; i < entries.length; i++) {
    let entry = entries[i]
    if(!fs.existsSync(cacheDir + '/' + entry)) {
      let url = `https://s3.amazonaws.com/smartdecovideos/${entry}`
      exec(`wget ${url} -O ${cacheDir}/${entry}`)
    }
  }
}


async function run() {
  if(!fs.existsSync(cacheDir))
    fs.mkdirSync(cacheDir)

  while(true) {
    const entries = await getCacheEntries()
    cacheNewEntries(entries)
    await delay(3600 * 1000) // check every hour for new content
  }
}

run()
