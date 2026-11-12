
import jwt from 'jsonwebtoken' 
import TryCatch from "../middlewares/trycatch.js";
import prisma from "../prisma.js";
import { AuthenticatedRequest } from '../middlewares/isAuth.js';
import User from '../model/User.js';
import { oauth2, oauth2_v2 } from 'googleapis/build/src/apis/oauth2/index.js';
import { oauth2client } from '../config/googleConfig.js';
import axios from 'axios'

export const loginUser=TryCatch(async(req,res)=>{
    const {code}=req.body;

    if(!code){
        return res.status(400).json({
            message:"Authorization code is required",
        });
    }

    const googleResponce=await oauth2client.getToken(code)

    oauth2client.setCredentials(googleResponce.tokens)

    const userResponce=await axios.get(`http://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponce.tokens}`);
    const {email,name,picture}=userResponce.data

        let user= await prisma.user.findUnique({
            where:{email},
        });

        if(!user){
            user=await prisma.user.create({
                data:{name,
                email,
                image:picture,
            },
            });
        }

        const token=jwt.sign({user},process.env.JWT_SEC as string,{
            expiresIn:"15d",
        });

        res.status(200).json({
            message:"Logged Success",
            token,
            user,
        });
});

const allowedRoles = [ "SENDER","TRAVELER","BUSINESS"] as const;
type Role=(typeof allowedRoles)[number];

export const addUserRole=TryCatch(async(req:AuthenticatedRequest,res)=>{
    if(!req.user?.id){
        return res.status(401).json({
            message:"Unauthorized",
        });
    }

    const {role}=req.body as { role:Role};
    console.log("RECEIVED ROLE:", JSON.stringify(role));
console.log("IS INCLUDED:", allowedRoles.includes(role));
    if(!allowedRoles.includes(role)){
        return res.status(400).json({
            message:"Invalid role",
        });
    }

    const user=await prisma.user.update({
        where:{id:req.user.id},
        data:{role}
    })

    if(!user){
        return res.status(404).json({
            message:"User not found",
        });
    }

    const token=jwt.sign({user},process.env.JWT_SEC as string,{
        expiresIn:"15d",
    });    

    return res.json({
        user,token,
    })
});

export const myProfile=TryCatch(async(req:AuthenticatedRequest,res)=>{
    const user=req.user
    res.json(user);
});