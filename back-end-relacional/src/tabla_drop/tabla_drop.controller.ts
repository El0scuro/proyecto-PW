import {
	BadRequestException,
	Controller,
	Delete,
	Param,
} from '@nestjs/common';
import { EdificioService as TablaDropService } from './tabla_drop.service.js';

@Controller('tabla-drop')
export class TablaDropController {
	constructor(private readonly tablaDropService: TablaDropService) {}

	@Delete(':nombreTabla')
	eliminarTablaPrueba(@Param('nombreTabla') nombreTabla: string) {
		if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(nombreTabla)) {
			throw new BadRequestException('El nombre de tabla no es válido.');
		}

		return this.tablaDropService.eliminarTablaPrueba(nombreTabla);
	}
}
