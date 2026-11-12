import {Request,Response,NextFunction} from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken'
import {User} from '@prisma/client';




export interface AuthenticatedRequest extends Request{
    user?:User|null;
}

export const isAuth=async(
    req:AuthenticatedRequest,
    res:Response,
    next:NextFunction):Promise<void>=>{
    try {
        const authHeader=req.headers.authorization;

        if(!authHeader||!authHeader.startsWith("Bearer ")){
            res.status(401).json({
                message:"Please Login- NO auth header"
            });
            return;
        }

        const token=authHeader.split(" ")[1];
        if(!token){
            res.status(401).json({
                message:"Please Login- Token missing"
            });
            return;
        }

        const decodeValue=jwt.verify(token,process.env.JWT_SEC as string) as JwtPayload;
        if(!decodeValue||!decodeValue.user){
           
            res.status(401).json({
                message:"Invalid token",
            });
            return;
        }

        req.user =decodeValue.user;
        next();
    } catch (error) {
        res.status(500).json({
            message:"Please Login-Jwt error",
        });
    }
}