import express from 'express';
import Bootstrapp from './app/bootstrapp';
import cors from 'cors';

const app = express();

app.use(express.json())
app.use(cors(
  {
    origin: '*'
  } 
));

Bootstrapp.init(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});