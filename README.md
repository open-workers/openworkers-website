# OpenWorkers Website

This is the source code for the OpenWorkers website. It is built Angular and hosted on GitHub Pages.

## Development

To run the website locally, you need to have Node.js installed. Then, run the following commands:
npm install
npm run dev

#### Test dist locally
```bash
docker run --rm --name some-nginx \
  -p 80:80 \
  -v ${PWD}/dist/browser:/usr/share/nginx/html:ro \
  -v ${PWD}/nginx.dev.conf:/etc/nginx/nginx.conf:ro \
  nginx:alpine
```

## Deployment

The website is [automatically deployed to GitHub Pages](https://github.com/marketplace/actions/deploy-to-github-pages) when changes are pushed to the master branch.

## Contributing

If you want to contribute to the OpenWorkers documentation, please read the [contributing guidelines](CONTRIBUTING.md).

## License

The OpenWorkers website is licensed under the [CC BY-SA 4.0 and CC0 1.0 Universal licenses](LICENSE).
