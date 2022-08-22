import { Controller, Request, Post, UseGuards, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategy/local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './strategy/jwt.guard';
import { RefreshAuthGuard } from './strategy/refresh.guard';
/**
 * Entité controllant l'ensemble des requêtes commençant par auth (ex: localhost/auth)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Route gérant la connexion à l'applicatif protégé par un guard 
   * @param req 
   * @returns 
   */
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) res : Response) {
    let token = await this.authService.login(req.user);
    let refreshToken = await this.authService.getRefreshToken(req.user.idUtilisateur)
    let secretData ={
      token,
      refreshToken : refreshToken
    };
    res.cookie("auth-cookie", secretData, {httpOnly : true, sameSite:'lax'})
    return token;
  }
  

  // @UseGuards(AADAuthGuard)
  // @Post('test')
  // async test(@Request() req) {
  //   return this.authService.login(req.user);
  // }
  
  @UseGuards(JwtAuthGuard)
  @Get('fav-movies')
  async movies(){
  return ["Avatar", "Avengers"];
  }
  
  @UseGuards(RefreshAuthGuard)
  @Get('refresh-tokens')
  async regenerateTokens(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(req.user);
    const refreshToken = await this.authService.getRefreshToken(
      req.user.idUtilisateur,
    );
    
    const secretData = {
      token,
      refreshToken,
    };
 
    res.cookie('auth-cookie', secretData, { httpOnly: true, sameSite:'lax'});
    return {msg:'success'};
}

}
