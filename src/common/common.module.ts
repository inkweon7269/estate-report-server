import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from '@root/common/common.service';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from '@root/common/const/path.const';
import { v4 as uuid } from 'uuid';
import { CommonController } from '@root/common/common.controller';

@Module({
    imports: [
        MulterModule.register({
            limits: {
                // 바이트 단위로 입력
                fileSize: 10000000,
            },
            fileFilter(
                req: any,
                file: {
                    fieldname: string;
                    originalname: string;
                    encoding: string;
                    mimetype: string;
                    size: number;
                    destination: string;
                    filename: string;
                    path: string;
                    buffer: Buffer;
                },
                callback: (error: Error | null, acceptFile: boolean) => void,
            ) {
                /**
                 * callback(에러, boolean)
                 *
                 * 첫 번째 파라미터에는 에러가 있을 경우 에러 정보를 넣어준다.
                 * 두 번째 파라미터에는 파일을 받을지 말지 boolean을 넣어준다.
                 */
                const ext = extname(file.originalname);
                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return callback(new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다!'), false);
                }

                return callback(null, true);
            },
            storage: multer.diskStorage({
                destination: function (req, res, cb) {
                    cb(null, TEMP_FOLDER_PATH);
                },
                filename: function (req, file, cb) {
                    cb(null, `${uuid()}${extname(file.originalname)}`);
                },
            }),
        }),
    ],
    controllers: [CommonController],
    providers: [CommonService],
    exports: [CommonService],
})
export class CommonModule {}
