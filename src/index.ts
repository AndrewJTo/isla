import express from 'express';
import {router} from './routes';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 5004;

const app = express();

app.use(bodyParser.text());

app.use('/', router);

app.listen(PORT, () => console.log(`server listening at port ${PORT}`));
