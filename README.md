# mbtiles-stacker

[![Build Status](https://travis-ci.org/Artsdatabanken/mbtiles-stacker.svg?branch=master)](https://travis-ci.org/Artsdatabanken/mbtiles-stacker)
[![Coverage Status](https://coveralls.io/repos/github/Artsdatabanken/mbtiles-stacker/badge.svg?branch=master)](https://coveralls.io/github/Artsdatabanken/mbtiles-stacker?branch=master)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[![Screenshot](doc/screenshot.png "ratatouille screenshot")](https://maps.artsdatabanken.no)

Demo: [mbtiles-stacker](https://maps.artsdatabanken.no)

mbtiles-stacker is a minimal raster tile composer. It can read multiple source mbtiles and stack the images into one tileset. Supports .mbtiles containing rasters of .png, .jpg.

## Upstream formats

- Raster tiles (x,y,z)
- WMS-C (tilematrixset,tilerow,tilecol)

## Installation

Put one or more .mbtiles inside the data subfolder.

Execute:

```
yarn
yarn start
```

Navigate to http://localhost:8000/ to display a summary of the tile sets.

Tiles can be pulled using an url of this form: http://localhost:8000/{name}/{zoom}/{x}/{y}

## Configuration

mbtiles-stacker has command-line options:

```
Usage: node mbtiles-stacker.js [options] [rootDirectory]

rootDirectory    Data directory containing .mbtiles

Options:
   -p PORT --port PORT       Set the HTTP port [8000]

A root directory is required.
```

## Images

The following images are built for each mbtiles-stacker release, using the Node.js base image.

- Latest: https://hub.docker.com/r/artsdatabanken/mbtiles-stacker/

### Docker image

To use prebuilt docker image, navigate to a folder containing .mbtile file(s) and run

```
docker run -v ${pwd}:/data -p 8000:8000 artsdatabanken/mbtiles-stacker
```
