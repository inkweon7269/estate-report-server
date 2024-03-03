import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '@root/common/entities/image.entity';
import { QueryRunner, Repository } from 'typeorm';
import { basename, join } from 'path';
import { REPORTS_IMAGE_PATH, TEMP_FOLDER_PATH } from '@root/common/const/path.const';
import { CreateReportImageDto } from '@root/common/dtos/create-image.dto';
import { promises } from 'fs';

@Injectable()
export class ReportImagesService {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepo: Repository<ImageEntity>,
    ) {}

    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<ImageEntity>(ImageEntity) : this.imageRepo;
    }

    async createReportImage(dto: CreateReportImageDto, qr?: QueryRunner) {
        const repository = this.getRepository(qr);

        /**
         * DTO 이미지 이름을 기반으로 파일 경로를 생성한다.
         */
        const tempFilePath = join(TEMP_FOLDER_PATH, dto.path);

        try {
            // 파일이 존재하는지 확인 존재하지 않는다면 에러를 던짐
            await promises.access(tempFilePath);
        } catch (e) {
            throw new BadRequestException('존재하지 않는 파일입니다.');
        }

        // 파일의 이름만 가져오기
        // aaa/bbb/abc.jpg -> abc.jpg
        const fileName = basename(tempFilePath);

        // 새로 이동할 폴더의 경로 + 이미지 이름
        const newPath = join(REPORTS_IMAGE_PATH, fileName);

        const result = await repository.save({
            ...dto,
        });

        // 파일 옮기기
        await promises.rename(tempFilePath, newPath);

        return result;
    }
}
