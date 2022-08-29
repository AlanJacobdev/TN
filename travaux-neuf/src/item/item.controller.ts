import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';

/**
 * Entité controllant l'ensemble des requêtes commençant par item (ex: localhost/item/5)
 * Permet de rediriger la requete vers la fonction dédiée 
 * 
 * Plus d'informations https://docs.nestjs.com/controllers
 */

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  getHistory(@Param('id') id: string){
    return this.itemService.getHistory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getItemByOR/:id')
  getItemByOR(@Param('id') id: string){
    return this.itemService.getItemByORAffichage(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getItemFromOrAndDispo/:id/:type')
  getItemFromOrAndDispo(@Param('id') id: string, @Param('type') type: string){
    return this.itemService.getItemFromOrAndDispo(id, type);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getItemForExport/:atelier/:typeObjet/:objetRepere/:dateDebut/:dateFin/:estActif/:estSecurite')
  getItemForExport(@Param('atelier') atelier: string, @Param('typeObjet') typeObjet: string, @Param('objetRepere') objetRepere: string, @Param('dateDebut') dateDebut: string,
  @Param('dateFin') dateFin : string, @Param('estActif') estActif : string, @Param('estSecurite') estSecurite : string){
    return this.itemService.getItemForExport(atelier, typeObjet, objetRepere, dateDebut, dateFin, estActif, estSecurite);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getTypeOfItemsOfOR/:id')
  getTypeOfItemsOfOR(@Param('id') id: string) {
    return this.itemService.getTypeOfItemsOfOR(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(id, updateItemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user : string) {
    return this.itemService.remove(id, user);
  }
}
