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

    app.setGlobalPrefix("/api",{exclude:["/profile"]})

    const PORT = await app.get(ConfigService).get("port");
    // Swagger documentation
    const documentConfig = new DocumentBuilder()
    .setTitle("Nestjs Healthcare Cloud-based Application")
    .setDescription(`
        Roles description: 
            - Admin: System Admins are allowed to request the endpoint.
            - User: All Users registered to the system can process the endpoint.
            - Doctor: All Doctors registered to the system can process the endpoint.
            - Patient: All Patients registered to the system can process the endpoint.
            - Owner: Owner of the schema can process the endpoint.
        `)
    .setBasePath(`http://localhost:${PORT}/api`)
    .setVersion("1.0")
    .addBearerAuth({
        type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header", name: "JWT",
    }, "JWT-User-Auth")
    .addBearerAuth({
        type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header", name: "JWT",
    }, "JWT-Admin-Auth")
    .addBearerAuth({
        type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header", name: "JWT",
    }, "JWT-Doctor-Auth")
    .addBearerAuth({
        type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header", name: "JWT",
    }, "JWT-Patient-Auth")
    .build();

    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup("/api/documentation", app, document);
    
    await app.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}`);
    });
}
bootstrap();