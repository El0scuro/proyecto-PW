import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AdministradorModule } from './administrador/administrador.module.js';
import { AsignaturaModule } from './asignatura/asignatura.module.js';
import { EdificioModule } from './edificio/edificio.module.js';
import { EstudianteModule } from './estudiante/estudiante.module.js';
import { NombresModule } from './nombres/nombres.module.js';
import { PisoModule } from './piso/piso.module.js';
import { ProfesorModule } from './profesor/profesor.module.js';
import { SalaModule } from './sala/sala.module.js';
import { SalaSeccionModule } from './sala_seccion/sala-seccion.module.js';
import { SeccionModule } from './seccion/seccion.module.js';
import { TablaDropModule } from './tabla_drop/tabla-drop.module.js';

import { createObserveModule } from '@nestjs/observe';

import { SecretariaModule } from './secretaria/secretaria.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AdministradorModule,
    AsignaturaModule,
    EdificioModule,
    EstudianteModule,
    NombresModule,
    PisoModule,
    ProfesorModule,
    SalaModule,
    SalaSeccionModule,
    SeccionModule,
    TablaDropModule,
    SecretariaModule,
    // SISTEMA
    TypeOrmModule.forRootAsync({
      name: 'sistema',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('SISTEMA_DB_HOST'),
        port: config.get<number>('SISTEMA_DB_PORT'),
        username: config.get<string>('SISTEMA_DB_USER'),
        password: config.get<string>('SISTEMA_DB_PASSWORD'),
        database: config.get<string>('SISTEMA_DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // ESTUDIANTE
    TypeOrmModule.forRootAsync({
      name: 'estudiante',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('ESTUDIANTE_DB_HOST'),
        port: config.get<number>('ESTUDIANTE_DB_PORT'),
        username: config.get<string>('ESTUDIANTE_DB_USER'),
        password: config.get<string>('ESTUDIANTE_DB_PASSWORD'),
        database: config.get<string>('ESTUDIANTE_DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // SECRETARIA
    TypeOrmModule.forRootAsync({
      name: 'secretaria',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('SECRETARIA_DB_HOST'),
        port: config.get<number>('SECRETARIA_DB_PORT'),
        username: config.get<string>('SECRETARIA_DB_USER'),
        password: config.get<string>('SECRETARIA_DB_PASSWORD'),
        database: config.get<string>('SECRETARIA_DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // ADMINISTRADOR
    TypeOrmModule.forRootAsync({
      name: 'administrador',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('ADMINISTRADOR_DB_HOST'),
        port: config.get<number>('ADMINISTRADOR_DB_PORT'),
        username: config.get<string>('ADMINISTRADOR_DB_USER'),
        password: config.get<string>('ADMINISTRADOR_DB_PASSWORD'),
        database: config.get<string>('ADMINISTRADOR_DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
