import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import * as config from './config/index.js';
import sessionConfig from './config/session.js';
import configurePassport from './config/passport.js';
import routes from './routes/index.js';
import db, { sequelize } from './models/index.js';

const app = express();

app.use(cookieParser(config.COOKIE_SECRET));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use('/', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('server error');
});

db.sequelize.sync().then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
});

export default app;