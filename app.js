import Express from "express";
import Session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";

// import bodyParser from 'body-parser';
import config, { SECRET } from './config';
import {dbConnector, sessionStore} from './components/config/db';

import userSchema from './components/model/User';
import userRoute from './components/route/user/user';

const PORT = config.PORT ? config.PORT : 4000;

const app = Express();
const router = Express.Router();


const authorizedOnly = (req, res, next) => {
    if(req.session && req.session.userId) return next();
    res.status(403).send();
}

// const corsExtension = (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', yourExactHostname);
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// };

app.use(cors({
    origin: true, // use true in dev, set with string in production
    credentials: true
}));
app.use(cookieParser());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

app.use(Session({
    name: "user_cookie",
    secret: SECRET,
    cookie: {
        secure: 'auto',
        expires: new Date(Date.now() + 36e5),
        maxAge: 36e5
    },
    saveUninitialized: false,
    resave: false,
    store: sessionStore
}))

app.get("/api/check", authorizedOnly, (req, res) => {
    if(req.session.viewCount) {
        req.session.viewCount++;
    } else {
        req.session.viewCount = 1;
    }
    res.send(`${req.session.viewCount}`);
});

app.get("/", authorizedOnly, (req, res) => {
    if(req.session.viewCount) {
        req.session.viewCount++;
    } else {
        req.session.viewCount = 1;
    }
    res.send(`${req.session.viewCount}`);
    // res.render("index", “)
})


app.use("/api/user", userRoute);
app.get("/api/auth", (req, res) => {
    res.json({message: "success"});
});

// app.get("/zzz", (req, res) => {
//     res.send("OK");
// })


(async() => {
    const mongoInstance = await dbConnector();
    if(mongoInstance.connection.readyState) { // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
        app.listen(PORT);
    }
})();
