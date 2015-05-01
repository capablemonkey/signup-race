# dwolla onboarding race

A little challenge to see how quickly you can create a new Dwolla Direct account, via the new OAuth account creation flow.

try it out: [https://registerrace.herokuapp.com](https://registerrace.herokuapp.com)

### set up

1. `npm install` any dependencies
2. you'll need a mongodb server
3. set the following environment variables:
```
HOST_URL:             https://registerrace.herokuapp.com
DWOLLA_ACCESS_TOKEN:  foo
DWOLLA_CLIENT_ID:     foo
DWOLLA_CLIENT_SECRET: foo
DWOLLA_PIN:           9999
MONGOLAB_URI:         mongodb://user:pass@host:port/db
```

or, edit the `config.js` file.
4. do `node bin/www`