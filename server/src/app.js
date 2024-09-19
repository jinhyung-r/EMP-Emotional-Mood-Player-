import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import * as config from './config/index.js';
import sessionConfig from './config/session.js';
import configurePassport from './config/passport.js';
import routes from './routes/index.js';
import db from './models/index.js';
import { checkAndRefreshToken } from './middlewares/tokenMiddleware.js';
import logger from './utils/logger.js';
import { errorHandler } from './middlewares/errorHanlder.js'
const app = express();

app.use(cookieParser(config.COOKIE_SECRET));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use(checkAndRefreshToken);

app.use('/', routes);

app.use(errorHandler);

app.use((err, req, res, _next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).send('An unexpected error occurred');
});

db.sequelize.sync().then(() => {
    app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
});

export default app;