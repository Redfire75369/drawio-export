# Draw.io exports via Puppeteer

Node.js module for exporting Draw.io diagrams to a range of formats using Puppeteer,
designed as a drop-in replacement for the Draw.io desktop CLI.

### Supported Formats
- JPEG
- PNG
- SVG
- PDF

## Contributing

### Setup

After cloning, make sure you get the vendored dependencies:
```console
git submodule update --init
```

### Testing

Tests are written with [Jest](https://jestjs.io/). To run them:
```console
yarn test
```

Add the `--watch` parameter to re-run the tests when changes are detected:
```console
yarn test --watch
```
