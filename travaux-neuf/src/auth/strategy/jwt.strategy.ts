import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { jwtKey } from "../constants";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    constructor(){
        super({
            ignoreExpiration: false,
            secretOrKey:jwtKey.secret,
            jwtFromRequest: ExtractJwt.fromExtractors([ (request:Request) => {
                let data = request?.cookies["auth-cookie"];
                if(!data){                    
                    return null;
                }
                
                return data.token.access_token;
            }])
            
            
        })
        
        
    }
 
    async validate(payload:any){
        
        if(!payload === null){
            throw new UnauthorizedException();
        }
        return payload;
    }
}