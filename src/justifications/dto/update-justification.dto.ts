import { PartialType } from '@nestjs/swagger';
import { CreateJustificationDto } from './create-justification.dto';

export class UpdateJustificationDto extends PartialType(CreateJustificationDto) { }
