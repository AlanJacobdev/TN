import { Injectable } from '@nestjs/common';
import { CreateServiceSuppressionDto } from './dto/create-service-suppression.dto';
import { UpdateServiceSuppressionDto } from './dto/update-service-suppression.dto';

@Injectable()
export class ServiceSuppressionService {
  create(createServiceSuppressionDto: CreateServiceSuppressionDto) {
    return 'This action adds a new serviceSuppression';
  }

  findAll() {
    return `This action returns all serviceSuppression`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceSuppression`;
  }

  update(id: number, updateServiceSuppressionDto: UpdateServiceSuppressionDto) {
    return `This action updates a #${id} serviceSuppression`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceSuppression`;
  }
}
