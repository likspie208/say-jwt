
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware')

const app = express();
const port = process.env.PORT || 3000;
const jwt = require('njwt');

const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
  scope: 'openid profile'
});
app.use(session({
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: false
}));
app.use(oidc.router);

app.get('/create', (req, res) => {
  const authToken = req.headers.authorization;
  if (authToken !== 'Basic QXp1cmVEaWFtb25kOmh1bnRlcjI=') {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Try -> username: AzureDiamond, password: hunter2');
    return;
  }
  // res.send(`TODO: verify this JWT ${JSON.stringify(req.headers.authorization)}`);
  const claims = { iss: 'fun', sub: 'AzureDiamond' };
  const token = jwt.create(claims, 'top-secret-phrase-aka-secret-key');
  token.setExpiration((new Date).getTime() + 25 * 1000);
  res.send(token.compact());
});

app.get('/verify/:token', (req, res) => {
  const { token } = req.params;
  jwt.verify(token, 'top-secret-phrase-aka-secret-key',
    (err, verifiedJwt) => {
      if (err) {
        res.send(err.message);
      }
      else {
        res.send(verifiedJwt);
      }
    });
});

app.get('/', oidc.ensureAuthenticated(), (req, res) => {
  res.send('hola chef !');
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
