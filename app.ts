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

// app imports





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
app.use(cors(corsOptions));
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


// server setup
const PORT = process.env.PORT || 5000;

const start = async () => {
    console.log(process.env.WHITELIST?.split(","))
    try {
        await dbConnect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        swaggerDocs(app, Number(PORT))
    }
    catch {
        console.error('Server failed to start');
        process.exit(1);
    }
}
start();
app.use(errorHandler);
