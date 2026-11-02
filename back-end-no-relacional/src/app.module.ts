import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AdministradorModule } from './collections/administrador/administrador.module.js';
import { AsignaturaModule } from './collections/asignatura/asignatura.module.js';
import { EdificioModule } from './collections/edificio/edificio.module.js';
import { EstudianteModule } from './collections/estudiante/estudiante.module.js';
import { HorarioModule } from './collections/horario/horario.module.js';
import { SalaModule } from './collections/sala/sala.module.js';
import { SeccionModule } from './collections/seccion/seccion.module.js';
import { SecretariaModule } from './collections/secretaria/secretaria.module.js';
import { DatabaseModule } from './database/database.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    DatabaseModule,
    AdministradorModule,
    AsignaturaModule,
    EdificioModule,
    EstudianteModule,
    HorarioModule,
    SalaModule,
    SeccionModule,
    SecretariaModule,
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'back-end-no-relacional',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
