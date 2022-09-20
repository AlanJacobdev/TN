import { Request, Controller, Get, Post, Body, Param, Delete, Put, UseGuards} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';
import { AADAuthGuard } from 'src/auth/strategy/aad-auth.guard';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par utilisateur (ex: localhost/utilisateur/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService ) {}

  /**
   * Creation d'un utilisateur
   * @param createUtilisateurDto : Informations utiles à la création
   * @returns Structure du nouvel utilisateur ou erreur
   */
  @UseGuards(JwtAuthGuard)  
  @Post()
  create(@Body() createUtilisateurDto: CreateUtilisateurDto) {
    return this.utilisateurService.create(createUtilisateurDto);
  }

  /**
   * Retourne l'ensemble des utilisateurs
   * @returns Liste des utilisateurs existant
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.utilisateurService.findAll();
  }

  /**
   * Retourne un utilisateur
   * @param id : Identifiant d'un utilisateur
   * @returns Structure de l'utilisateur recherché ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.utilisateurService.findOne(+id);
  }

  /**
   * Recherche le status administrateur d'un utilisateur donné
   * @param id : Identifiant d'un utilisateur
   * @returns True or false
   */
  @UseGuards(JwtAuthGuard)
  @Get('estAdmin/:id')
  estAdmin(@Param('id') id: string) {
    return this.utilisateurService.estAdmin(+id);
  }

  /**
   * Vérifie la concordance des mot de passe et l'existence du login
   * @param login : Login de l'utilisateur
   * @param password : Mot de passe de l'utilisateur
   * @returns Structure de l'utilisateur ou undefined (erreur)
   */
  @UseGuards(JwtAuthGuard)
  @Get('findOneConnexion/:login/:password')
  findOneConnexion(@Param('login') login: string, @Param('password') password: string ) {
    return this.utilisateurService.findOneConnexion(login, password);
  }

  /**
   * Retourne le nom et prénom d'un utilisateur
   * @param login : Login de l'utilisateur
   * @returns Nom et prénom de l'utilisateur
   */
  @UseGuards(JwtAuthGuard)
  @Get('getIdentityFromLogin/:login')
  findOneByLogin(@Param('login') login: string) {
    return this.utilisateurService.findOneByLogin(login);
  }
 
  /**
 * Retourne la liste des type d'objet repères accessibles pour un utilisateur
 * @param user : identifiant de l'utilisateur 
 * @returns Liste des types d'objet repère accessibles par un utilisateur 
 */
  @UseGuards(JwtAuthGuard)
  @Get('getTypeORFromUser/:user')
  getTypeORFromUser(@Param('user') user: string){
    return this.utilisateurService.getTypeORFromUser(user);
  }
  
  /**
   * Modification d'un utilisateur
   * @param id : identifiant de l'utilisateur
   * @param updateUtilisateurDto : Informations a modifier
   * @returns Structure de l'utilisateur modifiée ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateurService.update(+id, updateUtilisateurDto);
  }

  /**
   * Modifie le mot de passe de l'utilisateur
   * @param id : Identifiant de l'utilisateur
   * @param updateUtilisateurDto : Informations a modifier
   * @returns Structure de l'utilisateur(valide) ou erreur(echec)
   */
  @UseGuards(JwtAuthGuard)
  @Put('updatePwd/:id')
  updatePwd(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateurService.updatePwd(+id, updateUtilisateurDto);
  }

  /**
   * Modifie l'état de l'utilisateur (actif / inactif)
   * @param id : identifiant de l'utilisateur
   * @param updateUtilisateurDto : Informations a modifier
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Put('updateActif/:id')
  updateActif(@Param('id') id: string, @Body() updateUtilisateurDto: UpdateUtilisateurDto) {
    return this.utilisateurService.updateActif(+id, updateUtilisateurDto);
  }

  /**
   * Suppression d'un utilisateur
   * @param id : Identifiant de l'utilisateur 
   * @returns Message de validation ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utilisateurService.remove(+id);
  }

  /**
   * NON UTILISEE
   * @param id 
   * @param pwd 
   * @returns 
   */
  @UseGuards(JwtAuthGuard)
  @Get('connexion/exist/:id/:pwd')
  findUserOnCimaint(@Param('id') id: string, @Param('pwd') pwd: string){
    return this.utilisateurService.findUserOnCimaint(id,pwd);
  }
  
}
