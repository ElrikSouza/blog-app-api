import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserAccountModule } from './user-account/user-account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrpytModule } from './crpyt/crpyt.module';
import { AuthModule } from './auth/auth.module';
import { envVars } from './env';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    UserAccountModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: envVars.DATABASE_STRING,
      autoLoadEntities: true,
    }),
    CrpytModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
