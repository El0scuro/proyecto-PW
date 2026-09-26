import { Injectable } from '@nestjs/common';
import { Edificio } from './edificio.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EdificioService {

  constructor(
    @InjectRepository(Edificio, 'sistema')
    private edificioRepository: Repository<Edificio>
  ) {}

  async agregarEdificio(body: {Nombre: string, Direccion: string}) {
      const nuevo = this.edificioRepository.create({
          Direccion: body.Direccion,
          Nombre: body.Nombre
      });

      return await this.edificioRepository.save(nuevo);
  }
  async findAll() {
    return await this.edificioRepository.find();
  }
}
