// express imports
import express from 'express';
import { dbConnect } from './config/dbConnect';
const app = express();

// .env imports
require('dotenv').config({ path: '.env' });

// middleware imports
const cookiParser = require("cookie-parser");
import { errorHandler } from "./middlewares/error.middleware"
const cors = require('cors');

// route imports
import { authRoutes } from './routes/auth/auth.routes';
import { swaggerDocs } from './utils/swagger/swagger';
import { connectQueue, consumeDataFromQueue } from './utils/queue/rabbitmqsetup.utils';

// app imports
import { driverRoutes } from './routes/driver/driver.routes';
import { verifyToken } from './middlewares/verifyToken.middleware';
import { finderRoutes } from './routes/finder/finder.routes';
import { lookupsRoute } from './routes/lookups/lookups.routes';
// rate limiting
const rateLimit = require("express-rate-limit");

// Configure rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Define the duration of the window in milliseconds. Here it's set to 15 minutes.
    max: 100, // Define the maximum number of requests that each IP can make per window. Here it's set to 100.
    message: "Too many requests from this IP, please try again after 15 minutes", // Customize the message returned when the max limit is exceeded.
    headers: true, // Whether to include rate limit headers in the response. This can be useful for client-side rate limit handling.
    draft_polli_ratelimit_headers: true, // Whether to include the non-standard `RateLimit-*` headers.
    skipSuccessfulRequests: false, // Whether to count successful requests towards the rate limit. If set to true, only failed requests are counted.
});

// Apply the rate limiter to the app
app.use(limiter);



// base setup
const whitelist = process.env.WHITELIST!.split(',');
const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 200,
};
// app.use(cors(corsOptions));
app.use(cors());
// data from body
app.use(express.json({ limit: '16kb' }));
// for storing datas in public folder
app.use(express.static("public"))
// data from url{extended help in  reading object inside object}
app.use(express.urlencoded({ extended: true }));
// not required now
// app.use(bodyParser.json());
// for cookie reading
app.use(cookiParser());


// route path setup
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1',lookupsRoute)
app.use('/api/v1/driver', verifyToken, driverRoutes);
app.use('/api/v1/finder', verifyToken, finderRoutes);



// server setup
const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await dbConnect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        swaggerDocs(app, Number(PORT));
        // await connectQueue()
        // await consumeDataFromQueue();
    }
    catch {
        console.error('Server failed to start');
        process.exit(1);
    }
}
start();
app.use(errorHandler);
