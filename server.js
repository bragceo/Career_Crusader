

import express from 'express';
import {default as apiRoutes} from "./routes/index";
import * as sequelize from './models/index.js';
import { APP_CONFIG } from './config/config';

const app = express();
app.use(express.json());
app.use(apiRoutes);


app.listen(APP_CONFIG.port, () => console.log(`Server started on port ${APP_CONFIG.port}`));
