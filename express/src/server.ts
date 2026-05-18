import express from 'express';
import Bootstrapp from './app/bootstrapp';
import cors from 'cors';
import GlobalErrorHandler from './middleware/error.middleware';
import PinoLogger from './config/log/pino/pino';

const app = express();
const logger = new PinoLogger();
const globalErrorHandler = new GlobalErrorHandler(logger);

app.use(express.json())
app.use(cors(
  {
    origin: '*'
  } 
));

Bootstrapp.init(app);

app.use(globalErrorHandler.handleError);

app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});