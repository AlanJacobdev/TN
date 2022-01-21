import { Injectable } from '@nestjs/common';
import { CreateSousitemsaveDto } from './dto/create-sousitemsave.dto';
import { UpdateSousitemsaveDto } from './dto/update-sousitemsave.dto';

@Injectable()
export class SousitemsaveService {
  create(createSousitemsaveDto: CreateSousitemsaveDto) {
    return 'This action adds a new sousitemsave';
  }

  findAll() {
    return `This action returns all sousitemsave`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sousitemsave`;
  }

  update(id: number, updateSousitemsaveDto: UpdateSousitemsaveDto) {
    return `This action updates a #${id} sousitemsave`;
  }

  remove(id: number) {
    return `This action removes a #${id} sousitemsave`;
  }
}
