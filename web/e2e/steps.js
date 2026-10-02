const assert = require('node:assert/strict');
const fs = require('node:fs');
const { Then, When } = require('@cucumber/cucumber');

Then('the Angular app uses hash routing for {string}', function (path) {
  const config = fs.readFileSync('src/app/app.config.ts', 'utf8');
  const routes = fs.readFileSync('src/app/app.routes.ts', 'utf8');
  assert.match(config, /withHashLocation/);
  assert.match(routes, new RegExp(`path: '${path}'`));
});

When('the API hides private events', async function () {
  const response = await fetch('http://127.0.0.1:8095/api/v1/events');
  this.body = await response.json();
  this.status = response.status;
});

Then('a private title is absent from the public payload', function () {
  assert.equal(this.status, 200);
  const titles = this.body.map((row) => row.title);
  assert.equal(titles.includes('Dîner en Blanc Sacramento — table of 4'), false);
});
