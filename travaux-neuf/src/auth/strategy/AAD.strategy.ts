import { OIDCStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import passport, { authenticate } from 'passport';

@Injectable() 
export class AADStrategy extends PassportStrategy(OIDCStrategy, 'aad') {
    constructor () {
        super({
            identityMetadata: "https://login.microsoftonline.com/934f7349-18aa-4596-9ce2-a951b6794888/v2.0/.well-known/openid-configuration",
            clientID: "7705cae2-12a0-475c-bcd5-2c873563a3f1",
            responseType : 'code id_token',
            responseMode : 'form_post',
            passReqToCallback : true,
            allowHttpForRedirectUrl : true,
            redirectUrl : 'http://localhost:3000/utilisateur/existUser',
            clientSecret : "2.~8Q~9Fwphfbcxf5jp1S4iKmmbEQkaQ5wImxb6w",
            scope : ['profile', 'email'],
        },
        (req, iss, sub, profile, jwtClaims, access_token, refresh_token, params, done) => {
            if (!profile.oid) {
                return done(new Error("No oid found"), null);
              }
              // asynchronous verification, for effect...
              process.nextTick(function () {
                return done(null, profile);
              });
            
        })
        
        
        
    }

    async validate(payload: any){
        
      console.log("test");
          
    }
}