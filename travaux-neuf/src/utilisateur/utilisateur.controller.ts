import { Request, Controller, Get, Post, Body, Param, Delete, Put, UseGuards} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { AADAuthGuard } from 'src/auth/strategy/aad-auth.guard';

@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService ) {}

  @UseGuards(AADAuthGuard)
  @Post('/existUser')
  test(@Request() req){
    console.log(req.user.displayName);
    // console.log(req);
    
    return this.utilisateurService.test();
  }
  
  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }

  @Get()
  findAll() {
    return this.utilisateurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateurService.findOne(+id);
  }

  @Get('findOneConnexion/:login/:password')
  findOneConnexion(@Param('login') login: string, @Param('password') password: string ) {
    return this.utilisateurService.findOneConnexion(login, password);
  }
 

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateurService.update(+id, updateUtilisateurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilisateurService.remove(+id);
  }


  @Get('connexion/exist/:id/:pwd')
  findUserOnCimaint(@Param('id') id: string, @Param('pwd') pwd: string){
    return this.utilisateurService.findUserOnCimaint(id,pwd);
  }

  @UseGuards(AADAuthGuard)
  @Get('/existUser/:id/:pwd')
  userExistOrNot(@Request() req, @Param('id') id: string, @Param('pwd') pwd: string){
    return this.utilisateurService.userExistOrNot(req,id,pwd);
  }

 

}
