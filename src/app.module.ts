import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CoffeesController } from './coffees/coffees.controller';
// import { CoffeesService } from './coffees/coffees.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'iluvcoffee',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  // controllers: [AppController, CoffeesController],
  // providers: [AppService, CoffeesService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
