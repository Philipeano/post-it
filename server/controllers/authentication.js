import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'PostItGroupChatByPhilipeano' }));

const Users = [];

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    console.log('user logged out.')
  });
  res.redirect('/login');
});

app.use('/protected_page', (err, req, res, next) => {
  console.log(err);
  // User should be authenticated! Redirect him to log in.
  res.redirect('/login');
});
