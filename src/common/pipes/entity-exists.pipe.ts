import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export function EntityExistsPipe(entity: Type<any>): Type<PipeTransform> {
    @Injectable()
    class EntityExistsPipeCls implements PipeTransform {
        constructor(
            @InjectRepository(entity)
            private entityRepository: Repository<any>,
        ) {}

        async transform(value: any, metadata: ArgumentMetadata) {
            const exists = await this.entityRepository.findOneBy({ id: value });
            if (!exists) {
                throw new NotFoundException(`Entity with ID ${value} not found`);
            }
            return value;
        }
    }
    return EntityExistsPipeCls;
}
