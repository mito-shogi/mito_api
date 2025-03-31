#!/bin/zsh

git config --global --unset commit.template
git config --global --add safe.directory /home/vscode/app
git config --global fetch.prune true
git config --global --add --bool push.autoSetupRemote true
git config --global commit.gpgSign true
git config --global user.signingkey F9FA3E7A6C41F852
git branch --merged|egrep -v '\*|develop|main|master'|xargs git branch -d
