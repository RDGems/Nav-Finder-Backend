import express from 'express';
import { afterLocation, bookRide, cancelRide, getRides } from '../../controllers/finder/finder.controllers';
import { createDriver } from '../../controllers/driver/driver.controllers';
const finderRoutes=express.Router();

finderRoutes.post('/bookRide',bookRide);
finderRoutes.post('/getAfterLocation',afterLocation);
finderRoutes.get('/getRides',getRides);
finderRoutes.put('/cancelRide',cancelRide);

export {finderRoutes}