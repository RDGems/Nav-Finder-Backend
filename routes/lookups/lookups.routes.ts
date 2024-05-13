import express from "express";
import { lookups } from "../../controllers/lookups/lookups";

const lookupsRoute = express.Router();


lookupsRoute.post("/lookups", lookups);


export { lookupsRoute }