import { PickType } from '@nestjs/swagger';
import { ImageEntity } from '@root/common/entities/image.entity';

export class CreateReportImageDto extends PickType(ImageEntity, ['path', 'report', 'order', 'type']) {}
