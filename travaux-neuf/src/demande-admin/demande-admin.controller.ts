import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { DemandeAdminService } from './demande-admin.service';
import { CreateDemandeAdminDto } from './dto/create-demande-admin.dto';
import { UpdateDemandeAdminDto } from './dto/update-demande-admin.dto';


/**
 * Entité controllant l'ensemble des requêtes commençant par demande-admin (ex: localhost/demande-admin/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('demande-admin')
export class DemandeAdminController {
  constructor(private readonly demandeAdminService: DemandeAdminService) {}


  /**
   * Route créant une nouvelle demande de suppression
   * @param createDemandeAdminDto : Structure de la nouvelle demande de suppression
   * @returns Nouvelle demande ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDemandeAdminDto: CreateDemandeAdminDto) {
    return this.demandeAdminService.create(createDemandeAdminDto);
  }

  /**
   * Route retournant l'ensemble des demandes de suppression
   * @returns Liste des demandes de suppression
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.demandeAdminService.findAll();
  }

  /**
   * Route retournant les objets liés à une demande de suppression
   * @param idDmd : Identifiant de la demande de suppression
   * @returns Liste des objets liés
   */
  @UseGuards(JwtAuthGuard)
  @Get('/getAllObjectsFromDmd/:idDmd')
  getAllObjectsFromDmd(@Param('idDmd') idDmd: number) {
    return this.demandeAdminService.getAllObjectsFromDmd(idDmd);
  }

  /**
   * Route retournant l'arborescence d'un objet repère
   * @param idOr : Identifiant de l'objet repère
   * @returns Arborescence de l'objet repère
   */
  @UseGuards(JwtAuthGuard)
  @Get('getArborescenceOfOR/:idOr')
  getArborescenceOfOR(@Param('idOr') idOr: string) {
    return this.demandeAdminService.getArborescenceOfOR(idOr);
  }

  /**
   * Route retournant l'arborescence d'un item
   * @param idItem : Identifiant de l'item
   * @returns Arborescence de l'item
   */
  @UseGuards(JwtAuthGuard)
  @Get('getArborescenceOfItem/:idItem')
  getArborescenceOfItem(@Param('idItem') idItem: string) {
    return this.demandeAdminService.getArborescenceOfItem(idItem);
  }

  /**
   * Route traitant la validation ou non de la demande
   * @param id : Identifiant de la demande
   * @param profil : Profil traitant la demande
   * @param accept : Demande acceptée ou non
   * @returns Erreur ou message (bon déroulement)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/:profil/:accept')
  remove(@Param('id') id: string, @Param('profil') profil: string, @Param('accept') accept : string ) {
    return this.demandeAdminService.remove(+id, profil, accept);
  }

  /**
   * Route gérant l'envoie d'un e-mail aux administrateur en guise de notification
   * @param user : Utilisateur à l'origine de la demande
   * @param motif : Motif de la demande
   * @returns void
   */
  @UseGuards(JwtAuthGuard)
  @Get('/sendmail/:user/:motif')
  sendMail(@Param('user') user: string, @Param('motif') motif: string) {
    return this.demandeAdminService.sendMail(user,motif);
  }

}
