import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import logger from './utils/logger';
import {env} from '@/config/env';
import * as https from 'node:https';
import * as fs from 'node:fs';
import corsConfig from '@/config/corsConfig';
import session from 'express-session';
import api from '@/api';
import HTTPException from '@/exceptions/HTTPException';
import {saveSession} from "@/middleware/sessionMiddlewares";
import {requestLogger} from "@/middleware/requestMiddleware";
import multer from "multer";

const app = express();
const port = env.getIntOrFail('PORT');

// Middlewares
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(requestLogger);
app.use(
  session({
    secret: env.getOrFail('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
      secure: env.getOrFail('NODE_ENV') === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  })
);
app.use(saveSession);


// Routes
function route() {
  Object.entries(api).forEach(([prefix, router]) => {
    app.use(prefix, router);
  });
}

route();

// Not found handler
app.use(() => {
  throw new HTTPException(404, {message: 'Not Found'});
});

// Multer Error handler
app.use((err: any, _: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(400).send({errors: [{message: 'File size is too large'}]});
        break;
      case 'LIMIT_FILE_COUNT':
        res.status(400).send({errors: [{message: 'Exceeded maximum number of files'}]});
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).send({errors: [{message: `Unexpected file field ${err.field}`}]});
        break;
      default:
        res.status(400).send({
          errors: [{
            message: err.message ?? 'Invalid file',
            code: err.code ?? 'INVALID_FILE'
          }]
        });
    }
  } else {
    next(err);
  }
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof HTTPException) {
    res.status(err.status).json(err.details);
  } else {
    logger.error(err);
    res.status(500).json({message: 'Something broke!'});
  }
});


// Run server
function run() {
  if (env.get('NODE_ENV') === 'development') {
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } else {
    const httpsOptions = {
      key: fs.readFileSync(env.getOrFail('SSL_KEY')),
      cert: fs.readFileSync(env.getOrFail('SSL_CERT'))
    };

    https.createServer(httpsOptions, app).listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  }
}

run();
