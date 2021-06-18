import mongoose from 'mongoose';
import MongoStore  from "connect-mongo";
import { MONGODB_USER, MONGODB_PASS, MONGODB_PORT } from "../../config";

const hostURI = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@localhost:${MONGODB_PORT}`;
console.log(hostURI);
const dbConnector = () => {
    return new Promise(
        async (resolve, reject) => {
            try {
                const connector = await mongoose.connect(hostURI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,

                });
                console.log("Connected to DB");
                resolve(connector);
        } catch (e) {
                reject(e);
            }
        });
}

const sessionStore = MongoStore.create({
    mongoUrl: hostURI,
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
});

// const connectors = { dbConnector, sessionStore };

export { dbConnector, sessionStore };