import {google} from 'googleapis'
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_CLIEND_ID=process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENTSECRET;

export const oauth2client=new google.auth.OAuth2(
    GOOGLE_CLIEND_ID,
    GOOGLE_CLIENT_SECRET,
    "authmessage"
)