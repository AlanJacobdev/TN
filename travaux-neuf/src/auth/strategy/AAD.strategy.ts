import { OIDCStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable() 
export class AADStrategy extends PassportStrategy(OIDCStrategy, 'aad') {
    
    constructor (private authService: AuthService) {
        super({
            identityMetadata: "https://login.microsoftonline.com/934f7349-18aa-4596-9ce2-a951b6794888/v2.0/.well-known/openid-configuration",
            clientID: "7705cae2-12a0-475c-bcd5-2c873563a3f1",
            responseType : 'code id_token',
            responseMode : 'form_post',
            passReqToCallback : true,
            allowHttpForRedirectUrl : true,
            redirectUrl : 'http://localhost:3000/utilisateur/existUser',
            clientSecret : "2.~8Q~9Fwphfbcxf5jp1S4iKmmbEQkaQ5wImxb6w",
            scope : ['openid','profile'],
            // useCookieInsteadOfSession: true,
            // cookieEncryptionKeys: [ 
            //   { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
            //   { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
            // ],
            // nonceLifetime: null,
            // cookieSameSite: false,    
            // nonceMaxAmount: 5,
            // clockSkew: null,
            validateIssuer: true,
            issuer: "https://login.microsoftonline.com/934f7349-18aa-4596-9ce2-a951b6794888/v2.0",
            loggingLevel: 'info',
            
        },
        function(req, iss, sub, profile, accessToken, refreshToken, done) {
         
          
          console.log("===========ISS===============");
          console.log(iss);
          console.log("===========PROFILE==============="); 
          console.log(profile);
          console.log("===========SUB===============");
          console.log(sub);
          console.log("===========ACCESSTOKEN===============");
          console.log(accessToken);
          console.log("===========REFRESHTOKEN===============");
          console.log(refreshToken);
          console.log("===========DONE===============");
          if (!profile.oid) {
            return done(new Error("No oid found"), null);
          }
          return done(null,profile);
        
      });
      
    }

  async validate(response: any){      
    // const user = this.authService.selectUser(response.user)    
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;  
    console.log("test");
    
    return response 
  }

 


    
}


