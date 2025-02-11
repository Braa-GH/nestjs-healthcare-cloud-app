import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: "*"
        },
    });

    const PORT = await app.get(ConfigService).get("port");
    // Swagger documentation
    const documentConfig = new DocumentBuilder()
    .setTitle("Nestjs Healthcare Cloud-based Application")
    .setDescription(``)
    .setBasePath(`http://localhost:${PORT}/api`)
    .setVersion("1.0")
    // .addBearerAuth({
    //     type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header", name: "JWT"
    // }, "JWT-auth")
    .build();

    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup("/api/documentation", app, document);
    
    await app.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}`);
    });
}
bootstrap();