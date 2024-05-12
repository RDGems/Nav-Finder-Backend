import express from 'express';
import { bookRide } from '../../controllers/finder/finder.conntrollers';
const finderRoutes=express.Router();

finderRoutes.post('/bookRide',bookRide);

export {finderRoutes}