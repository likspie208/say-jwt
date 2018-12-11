



const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const jwt = require('njwt');

app.get('/create', (req, res) => {
  const authToken = req.headers.authorization;
  console.log('req.headers.authorization', req.headers.authorization);
  if (authToken !== 'Basic QXp1cmVEaWFtb25kOmh1bnRlcjI=') {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Try -> username: AzureDiamond, password: hunter2');
    return;
  }
  // res.send(`TODO: verify this JWT ${JSON.stringify(req.headers.authorization)}`);
  const claims = { iss: 'fun', sub: 'AzureDiamond' };
  const token = jwt.create(claims, 'top-secret-service');
  token.setExpiration((new Date).getTime() + 1 * 1000);
  res.send(token.compact());
});

app.get('/verify/:token', (req, res) => {
  res.send(`TODO: verify this JWT token, ${req.params.token}`);
});

app.get('/', (req, res) => res.send('TODO: use OKTA for authorization'));

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
