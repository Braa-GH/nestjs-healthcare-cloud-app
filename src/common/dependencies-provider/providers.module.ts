import { forwardRef, Module } from "@nestjs/common";
import { AdminModule } from "src/admin/admin.module";
import { DoctorModule } from "src/doctor/doctor.module";
import { DocumentModule } from "src/document/document.module";
import { PatientModule } from "src/patient/patient.module";
import { UserModule } from "src/user/user.module";
import { AdminService } from "src/admin/admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin } from "src/admin/admin.entity";
import { DoctorService } from "src/doctor/doctor.service";
import { PatientService } from "src/patient/patient.service";
import { UserService } from "src/user/user.service";
import { DocumentService } from "src/document/document.service";
import { Doctor } from "src/doctor/doctor.entity";
import { Patient } from "src/patient/patient.entity";
import { User } from "src/user/user.entity";
import { Document, documentSchema } from "src/document/document.schema";
import { SpecialtyModule } from "src/specialty/specialty.module";
import { SpecialtyService } from "src/specialty/specialty.service";
import { Specialty } from "src/specialty/specialty.entity";

@Module({
  imports: [
        forwardRef(() => AdminModule),
        forwardRef(() => UserModule),
        forwardRef(() => DoctorModule),
        forwardRef(() => PatientModule),
        forwardRef(() => DocumentModule),
        SpecialtyModule,
        TypeOrmModule.forFeature([Admin, Doctor, Patient, User, Document, Specialty]),
        MongooseModule.forFeature([{name: Document.name, schema: documentSchema}])
    ],
  providers: [AdminService, DoctorService, PatientService, UserService, DocumentService, SpecialtyService],
  exports: [AdminService, DoctorService, PatientService, UserService, DocumentService, SpecialtyService],
})
export class ProvidersModule {}