import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

@Module({
  //some cool comment
  //another one of cool comments

  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, UserModule],
})
export class AppModule {}
