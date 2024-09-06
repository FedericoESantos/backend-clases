import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        
        cb(null, './src/public/img/products');
        
    },
    filename:(req,file,cb)=>{

        cb(null, file.originalname);
    }
})

export const upload = multer({storage:storage});

export const generaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword=(password, passwordHash) => bcrypt.compareSync(password, passwordHash);