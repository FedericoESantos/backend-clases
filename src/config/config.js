import  dotenv  from "dotenv";

dotenv.config({
    path:"./src/.env", override:true
});

export const config={
    PORT: process.env.port || 8000,
    MONGO_URL: process.env.MONGO_URL,
    DBNAME: process.env.DBNAME,
    PERSISTENCE: process.env.PERSISTENCE,
    SECRET: process.env.SECRET,
    CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
    CLAVE_CLIENT_SECRET: process.env.CLAVE_CLIENT_SECRET
}