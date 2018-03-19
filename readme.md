# Tech test for HolidayExtras
This is the front end portion of the tech test for HolidayExtras

# Getting Started
## Installing
- `npm install` should do all the heavy lifting.
- `npm run build` bundles the code to `./bundle.js`.
- `npm run css` turns the sass in `style.scss` into usable css in `style.css`

### Keys.js
This is somewhat of an experiment I'm testing out. Similar to environment variables on backends, I wanted to try hide my keys/token as much as possible on the front, thus `keys.js`.

The idea is: in a production environment, `keys.js` would have its access globally denied except from calls being made from its own domain, thus somewhat protecting it from public view. Obviously network/api calls made from the front would be logged by the browser and contain the key, but there's no preventing that.

The key for flickr can be found at: `https://www.flickr.com/services/apps/<app id>/key/` (via `https://www.flickr.com/services/apps/by/<your flickr user id>`)

#### Example keys.js
```
  window.flickrTokens = {
    "Key": "abc123"
  }
```

## Running
- Run a local server over `http` using something like [http-server](https://www.npmjs.com/package/http-server) and visit your local url.

## TODO
- Add more rigorous mistake/error checking in functions
- Add proper unit testing unit suite
- Add searching by username

## Built With
- [VueJS](https://vuejs.org/)
- [Sass](http://sass-lang.com/)
- [Nodemon](https://github.com/remy/nodemon/)
- [Webpack](https://www.npmjs.com/package/webpack)
