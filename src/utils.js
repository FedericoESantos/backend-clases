import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './src/public/img/products');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
})

export const upload = multer({storage:storage});

export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword=(password, passwordHash) => bcrypt.compareSync(password, passwordHash);


const transporter = nodemailer.createTransport(
    {
        service:"gmail",
        port: 465, 
        auth:{
            user: "boomarts47@gmail.com",
            pass: " ypsu ahqu hnpr vjma"
        },
    });

export const enviarMail = async(to, subject, message) =>{
    return transporter.sendMail(
        {
            from: "Kataplum Artistico, una empresa lider en las creaciones 3D, boomarts47@gmail.com",
            to: to,
            subject: subject,
            html: message 
        }
    )
}