#!/bin/bash
parcel build index.html --out-dir docs
git stage .
git commit -m "another build"
git push
