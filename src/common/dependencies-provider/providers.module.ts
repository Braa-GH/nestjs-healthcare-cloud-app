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
import { PatientApplicationModule } from "src/patient-application/patient-application.module";
import { PatientApplicationService } from "src/patient-application/patient-application.service";
import { PatientApplication } from "src/patient-application/patient-application.schema";
import { DoctorApplicationModule } from "src/doctor-application/doctor-application.module";
import { DoctorApplication } from "src/doctor-application/doctor-application.schema";
import { DoctorApplicationService } from "src/doctor-application/doctor-application.service";

@Module({
  imports: [
        forwardRef(() => AdminModule),
        forwardRef(() => UserModule),
        forwardRef(() => DoctorModule),
        forwardRef(() => PatientModule),
        forwardRef(() => DocumentModule),
        forwardRef(() => PatientApplicationModule),
        forwardRef(() => DoctorApplicationModule),
        SpecialtyModule,
        TypeOrmModule.forFeature([Admin, Doctor, Patient, User, Document, Specialty]),
        MongooseModule.forFeature([
          {name: Document.name, schema: documentSchema},
          {name: PatientApplication.name, schema: PatientApplication},
          {name: DoctorApplication.name, schema: DoctorApplication},
        ])
    ],
  providers: [
    AdminService, DoctorService, PatientService, UserService,
    DocumentService, SpecialtyService, PatientApplicationService, DoctorApplicationService
  ],
  exports: [
    AdminService, DoctorService, PatientService, UserService,
    DocumentService, SpecialtyService, PatientApplicationService, DoctorApplicationService
  ],
})
export class ProvidersModule {}