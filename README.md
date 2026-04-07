[![Published on npm](https://img.shields.io/npm/v/@flowingcode/google-map.svg)](https://www.npmjs.com/package/@flowingcode/google-map)

# Google Map

Web components for embedding and interacting with Google Maps.

## Features

* Display an interactive Google Map (`google-map`)
* Add draggable and customizable markers (`google-map-marker`)
* Draw polygons, polylines, and rectangles on the map (`google-map-poly`)
* Define geographic points for use with poly elements (`google-map-point`)
* Support for marker clustering
* Touch-and-hold gesture to simulate right-click on mobile

## Download release

[Available on npm](https://www.npmjs.com/package/@flowingcode/google-map)

### npm install

```
npm install @flowingcode/google-map
```

Then import the components you need like:

```js
import '@flowingcode/google-map/google-map.js';
import '@flowingcode/google-map/google-map-marker.js';
```

## Usage

```html
<google-map api-key="YOUR_API_KEY" fit-to-markers>
  <google-map-marker latitude="37.78" longitude="-122.4" draggable="true"></google-map-marker>
</google-map>
```

## Building and running demo

- git clone repository
- npm install
- npm start

The demo will open automatically at `http://localhost:8000/demo/`. A valid [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) is required — pass it as a query parameter:

```
http://localhost:8000/demo/?api-key=YOUR_API_KEY
```
For polys: 

```
http://localhost:8000/demo/polys.html?api-key=YOUR_API_KEY
```

## Release notes

See [here](https://github.com/FlowingCode/google-map/releases)

## Issue tracking

The issues for this add-on are tracked on its github.com page. All bug reports and feature requests are appreciated.

## Contributions

Contributions are welcome. There are two primary ways you can contribute: by reporting issues or by submitting code changes through pull requests. To ensure a smooth and effective process for everyone, please follow the guidelines below for the type of contribution you are making.

#### 1. Reporting Bugs and Requesting Features

Creating an issue is a highly valuable contribution. If you've found a bug or have an idea for a new feature, this is the place to start.

* Before creating an issue, please check the existing issues to see if your topic is already being discussed.
* If not, create a new issue. Try to keep the scope minimal but as detailed as possible.

> **A Note on Bug Reports**
>
> While all details are important, a **[minimal, reproducible example](https://stackoverflow.com/help/minimal-reproducible-example)** is the most critical part of your report. It's essential because it removes ambiguity and allows our team to observe the problem firsthand, exactly as you are experiencing it.

#### 2. Contributing Code via Pull Requests

As a first step, please refer to our [Development Conventions](https://github.com/FlowingCode/DevelopmentConventions) page to find information about Conventional Commits & Code Style requirements.

Then, follow these steps for creating a contribution:

- Fork this project.
- Create an issue to this project about the contribution (bug or feature) if there is no such issue about it already. Try to keep the scope minimal.
- Develop and test the fix or functionality carefully. Only include minimum amount of code needed to fix the issue.
- For commit message, use [Conventional Commits](https://github.com/FlowingCode/DevelopmentConventions/blob/main/conventional-commits.md) to describe your change.
- Send a pull request for the original project.
- Comment on the original issue that you have implemented a fix for it.

# Developer Guide

## Getting started

```html
<google-map api-key="YOUR_API_KEY" latitude="37.78" longitude="-122.4" zoom="12">
  <google-map-marker latitude="37.78" longitude="-122.4" title="My location"></google-map-marker>
</google-map>
```

You need a valid [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) to use these components.
