import { PartialType } from '@nestjs/mapped-types';
import { CreateQuantityCheckDto } from './create-quantity-check.dto';

export class UpdateQuantityCheckDto extends PartialType(CreateQuantityCheckDto) {}
