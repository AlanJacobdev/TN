import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { jwtKey } from "../constants";

 
/**
 * Strategie vérifiant la présence d'un jeton de connexion au sein de la requête ainsi que son expiration
 */
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
   
    /**
   * Constructeur de la classe 
   * Injection de Repository et autres services utilisés par cette classe
   * Plus d'informations : https://docs.nestjs.com/providers
   */
    constructor(private authService: AuthService, private jwt : JwtService){
        super({
            ignoreExpiration: true,
            passReqToCallback:true,
            secretOrKey:jwtKey.secret,
            jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
                let data = request?.cookies["auth-cookie"];
                if(!data){
                    return null;
                }
                return data.token.access_token;
            }])
        })
    }
 
    /**
     * Methode de validation après existence d'un token
     * @param req Requete entrante
     * @param payload User
     * @returns Exception si erreur ou utilisateur
     */
    async validate(req:Request, payload:any){
        if(!payload){
            throw new BadRequestException('invalid jwt token');
        }
        let data = req?.cookies["auth-cookie"];
        
        let res = data.token.access_token;
        let decoderes :any = this.jwt.decode(res);
        let exptime = decoderes.exp
        let limiteInactivite : any= new Date(exptime*1000 + jwtKey.timeSession * 60000);
      
        
        limiteInactivite = limiteInactivite.getTime();
        let currentDate = new Date().getTime();
       
        
        if(currentDate > limiteInactivite){
            throw new BadRequestException('Inactivité depuis le dernier refresh');
        }
        
        if(!data?.refreshToken){
            throw new BadRequestException('invalid refresh token');
        }
        let user = await this.authService.validRefreshToken(payload.login, data.refreshToken);        
        
        if(!user){
            throw new BadRequestException('token expired');
        }
 
        return user;
    }
}