import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { EmployeesModule } from './employees/employees.module';
import { OrdersModule } from './orders/orders.module';
import { SpecialOrdersModule } from './special-orders/special-orders.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    ProductsModule,
    EmployeesModule,
    OrdersModule,
    SpecialOrdersModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
