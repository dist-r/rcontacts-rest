import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from './utils/jwt.service';
import { PostgresService } from './database/raw/postgres.service';

@Module({
  providers: [AuthGuard, JwtService, PostgresService],
  exports: [AuthGuard, PostgresService, JwtService],
})
export class CommonModule {}
