import express from 'express';
import { afterLocation, bookRide, cancelRide, getRides } from '../../controllers/finder/finder.controllers';
const finderRoutes=express.Router();

finderRoutes.post('/bookRide',bookRide);
finderRoutes.post('/getAfterLocation',afterLocation);
finderRoutes.get('/getRides',getRides);
finderRoutes.put('/rideActions',cancelRide);

export {finderRoutes}