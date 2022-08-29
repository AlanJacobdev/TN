import { Request, Controller, Get, Post, Body, Param, Delete, Put, UseGuards} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { AADAuthGuard } from 'src/auth/strategy/aad-auth.guard';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService ) {}

  @UseGuards(JwtAuthGuard)  
  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.utilisateurService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateurService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('estAdmin/:id')
  estAdmin(@Param('id') id: string) {
    return this.utilisateurService.estAdmin(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findOneConnexion/:login/:password')
  findOneConnexion(@Param('login') login: string, @Param('password') password: string ) {
    return this.utilisateurService.findOneConnexion(login, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getIdentityFromLogin/:login')
  findOneByLogin(@Param('login') login: string) {
    return this.utilisateurService.findOneByLogin(login);
  }
 
  @UseGuards(JwtAuthGuard)
  @Get('getTypeORFromUser/:user')
  getTypeORFromUser(@Param('user') user: string){
    return this.utilisateurService.getTypeORFromUser(user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateurService.update(+id, updateUtilisateurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updatePwd/:id')
  updatePwd(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateurService.updatePwd(+id, updateUtilisateurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateActif/:id')
  updateActif(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateurService.updateActif(+id, updateUtilisateurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilisateurService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('connexion/exist/:id/:pwd')
  findUserOnCimaint(@Param('id') id: string, @Param('pwd') pwd: string){
    return this.utilisateurService.findUserOnCimaint(id,pwd);
  }
  
}
