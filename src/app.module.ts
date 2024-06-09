import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { setTypeOrmConfig } from './setting/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { CommonModule } from './common/common.module';
import { ReportModule } from './resource/report/report.module';
import { UserModule } from './resource/user/user.module';
import { AuthModule } from './resource/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: setTypeOrmConfig,
            dataSourceFactory: async (options) => {
                if (!options) {
                    throw new Error('Invalid options passed');
                }
                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        CommonModule,
        ReportModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
