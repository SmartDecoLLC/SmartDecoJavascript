#!/bin/bash

# on raspbian, apt-get throws an error about chksshpwd. this fixes it
sudo rm -rf /var/lib/chksshpwd/ ; sudo apt-get install -y libpam-chksshpwd


# install node/npm
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

sudo apt-get install -y nodejs build-essential

sudo apt-get update

sudo apt-get upgrade

# install and configure dependencies required by snowboy
sudo apt-get install -y python-pyaudio python3-pyaudio sox libatlas-base-dev libmagic-dev libasound2-dev
#wget https://bootstrap.pypa.io/get-pip.py
#python get-pip.py
#pip install pyaudio


# on my laptop, this fixes the "Illegal instruction: 4" segfault that happens when a speaker stream closes
# perhaps this is unnecessary on pi but listing here just in case
#npm install speaker --mpg123-backend=openal


npm install


# configure service-interview to run automatically at boot, restart on failure
sudo cp smartdeco.service /lib/systemd/system/

sudo systemctl daemon-reload

sudo systemctl enable smartdeco.service

sudo systemctl start smartdeco.service
