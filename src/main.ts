import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NotFoundExceptionFilter } from "./exceptions";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new NotFoundExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
