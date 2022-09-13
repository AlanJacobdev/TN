import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { DemandeAdminTraiteeService } from './demande-admin-traitee.service';
import { CreateDemandeAdminTraiteeDto } from './dto/create-demande-admin-traitee.dto';

/**
 * Entité controllant l'ensemble des requêtes commençant par demande-admin-traitee (ex: localhost/demande-admin-traitee/5)
 * Permet de rediriger la requete vers la fonction dédiée
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('demande-admin-traitee')
export class DemandeAdminTraiteeController {
  constructor(private readonly demandeAdminTraiteeService: DemandeAdminTraiteeService) {}

  /**
   * Route créant une demande de suppression traitée
   * @param createDemandeAdminTraiteeDto : Structure de la demande de suppression traitée
   * @returns Nouvelle demande de suppression traitée ou erreur
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDemandeAdminTraiteeDto: CreateDemandeAdminTraiteeDto) {
    return this.demandeAdminTraiteeService.create(createDemandeAdminTraiteeDto);
  }

  /**
   * Route retournant l'ensemble des demande de suppression traitées
   * @returns Liste des demande de suppression traitées
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.demandeAdminTraiteeService.findAll();
  }

  /**
   * Recupère l'ensemble des objets liés à la demande traitée
   * @param idDmd : Identifiant de la demande de supression traitée
   * @returns Liste des objets liés à la demande
   */
  @UseGuards(JwtAuthGuard)
  @Get('/getAllObjectsFromDmd/:idDmd')
  getAllObjectsFromDmd(@Param('idDmd') idDmd: number) {
    return this.demandeAdminTraiteeService.getAllObjectsFromDmd(idDmd);
  }

  /**
   * Route retournant l'arborescence d'un objet repère
   * @param idOr : Identifiant de l'objet repère
   * @param date : Date de traitement de la demande
   * @returns Arborescence de l'objet repère
   */
  @UseGuards(JwtAuthGuard)
  @Get('getArborescenceOfOR/:idOr/:date')
  getArborescenceOfOR(@Param('idOr') idOr: string, @Param('date') date: Date) {
    return this.demandeAdminTraiteeService.getArborescenceOfOR(idOr, date);
  }

  /**
   * Route retournant l'arborescence d'un item
   * @param idItem : Identifiant de l'item
   * @param date : Date de traitement de la demande
   * @returns Arborescence de l'item
   */
  @UseGuards(JwtAuthGuard)
  @Get('getArborescenceOfItem/:idItem/:date')
  getArborescenceOfItem(@Param('idItem') idItem: string, @Param('date') date: Date) {
    return this.demandeAdminTraiteeService.getArborescenceOfItem(idItem, date);
  }
}
