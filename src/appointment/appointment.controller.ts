import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { BodyNotEmptyPipe } from 'src/common/pipes/validate-body.pipe';
import { DateHandlerService } from 'src/common/date-handler/date-handler.service';
import { PatientService } from 'src/patient/patient.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongoId.pipe';
import { FollowupDto } from './dto/followup.dto';
import { Interval, parseJSON } from 'date-fns';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentExistPipe } from './pipes/appointment-exist.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AppointmentOwnerGuard } from './guards/appointment-owner.guard';
import { Roles } from 'src/common/enums';
import { DoctorExistPipe } from 'src/doctor/pipes/doctor-exist.pipe';
import { ValidateDoctorIdPipe } from 'src/doctor/pipes/validate-doctor-id.pipe';
import { OwnerGuard } from 'src/auth/guards/owner.guard';
import { PatientExistPipe } from 'src/patient/pipes/patient-exist.pipe';
import { ValidatePatientIdPipe } from 'src/patient/pipes/validate-patient-id.pipe';
import { AppointmentDoctorGuard } from './guards/appointment-doctor.guard';

@Controller("appointment")
@ApiTags("Appointment Endpoints")
export class AppointmentController {
    constructor(
        private appointmentService:AppointmentService,
        private dateService: DateHandlerService,
        private patientService: PatientService,
        private doctorService: DoctorService,
    ){}

    @Post()
    @Auth(null, Roles.Admin, Roles.Doctor, Roles.Patient)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiOperation({summary: "Create an Appointment.", description: "Roles: [Admin,Doctor,Patient]"})
    async createAppointment(@Body(BodyNotEmptyPipe,ValidationPipe) appointmentDto: CreateAppointmentDto){
        const { doctorId, patientId, startTime, periodInMinutes } = appointmentDto;
        const patient = await this.patientService.findOne({id: patientId});
        const doctor = await this.doctorService.findOne({id: doctorId});
        if(!patient || !doctor){
            throw new BadRequestException("Patient or Doctor is not exist!")
        }
        const endTime = this.dateService.getEndTime(parseJSON(startTime), periodInMinutes);
        
        const appointments = await this.appointmentService.findAll({doctorId, patientId});
        const newInterval: Interval = {
            start: parseJSON(appointmentDto.startTime),
            end: endTime
        }

        const isOverlaps = appointments.find(appointment => {
            const oldInterval: Interval = {
                start: parseJSON(appointment.startTime),
                end: appointment.endTime
            }
            return this.dateService.isPeriodsOverlapping(oldInterval, newInterval);
        })
        if(isOverlaps)
            throw new BadRequestException("Doctor or Patient is busy at provided appointment period!")
        return this.appointmentService.create(appointmentDto);
    }

    @Post(":appointmentId/add-followup")
    @Auth(AppointmentOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiOperation({summary: "Add a followup to an Appointment.", description: "Roles: [Admin,Owner]"})
    @ApiParam({name: "appointmentId", example: "67810547cb30f8e35f989685"})
    async addFollowup(
        @Param("appointmentId", ParseMongoIdPipe) appointmentId: string,
        @Body(BodyNotEmptyPipe,ValidationPipe) followupDto: FollowupDto
    ){
        const appointment = await this.appointmentService.findOne({_id: appointmentId});
        if(!appointment)
            throw new NotFoundException("Appointment Not Found");
        const { patientId, doctorId } = appointment;
        const endTime = this.dateService.getEndTime(parseJSON(followupDto.startTime), followupDto.periodInMinutes);
        const newInterval: Interval = {
            start: parseJSON(followupDto.startTime),
            end: endTime
        }
        
        const appointments = await this.appointmentService.findAll({doctorId, patientId});
        
        const isOverlaps = appointments.find(appointment => {
            const oldInterval: Interval = {
                start: parseJSON(appointment.startTime),
                end: parseJSON(appointment.endTime)
            }
            console.log(oldInterval);
            
            return this.dateService.isPeriodsOverlapping(oldInterval, newInterval);
        })
        if(isOverlaps)
            throw new BadRequestException("Doctor or Patient is busy at provided appointment period!");
        return await this.appointmentService.addFollowup(appointmentId, {...followupDto,patientId,doctorId,endTime});
    }

    @Get()
    @Auth(null, Roles.Admin)
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiOperation({summary: "Get All AppointmentsAppointment.", description: "Roles: [Admin]"})
    @ApiQuery({name: "patientId",required: false, example: "pt-012025-3a60f4"})
    @ApiQuery({name: "doctorId",required: false, example: "dr-012025-fdf717"})
    getAppointments(
        @Query("patientId") patientId: string,
        @Query("doctorId") doctorId: string,
    ){
        return this.appointmentService.findAll({patientId, doctorId, ignoreFollowups: true});
    }

    @Get("doctor-appointments/:doctorId")
    @Auth(OwnerGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiOperation({summary: "Get All Appointments for a doctor.", description: "Roles: [Admin,Doctor-Owner]"})
    @ApiParam({name: "doctorId",example: "dr-012025-fdf717"})
    getDoctorAppointments(@Param("doctorId", ValidateDoctorIdPipe, DoctorExistPipe) doctorId: string){
        return this.appointmentService.getDoctorAppointments(doctorId);
    }

    @Get("patient-appointments/:patientId")
    @Auth(OwnerGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiOperation({summary: "Get All Appointments for a patient.", description: "Roles: [Admin,Patient-Owner]"})
    @ApiParam({name: "patientId",example: "pt-012025-3a60f4"})
    getPatientAppointments(@Param("patientId", ValidatePatientIdPipe, PatientExistPipe) patientId: string){
        return this.appointmentService.getPatientAppointments(patientId);
    }

    @Get(":appointmentId")
    @Auth(AppointmentOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiOperation({summary: "Get an Appointment By ID.", description: "Roles: [Admin,Owner]"})
    @ApiParam({name: "appointmentId", example: "67810547cb30f8e35f989685"})
    getAppointmentById(@Param("appointmentId",ParseMongoIdPipe) appointmentId: string){
        return this.appointmentService.findOne({_id: appointmentId});
    }

    @Patch(":appointmentId")
    @Auth(AppointmentOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiOperation({summary: "Update an Appointment.", description: "Roles: [Admin,Owner]"})
    @ApiParam({name: "appointmentId", example: "67810547cb30f8e35f989685"})
    updateAppointment(
        @Param("appointmentId",ParseMongoIdPipe,AppointmentExistPipe) appointmentId: string,
        @Body(ValidationPipe) appointmentDto: UpdateAppointmentDto
    ){
        return this.appointmentService.update(appointmentId, appointmentDto);
    }

    @Patch(":appointmentId/accept")
    @Auth(AppointmentDoctorGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiOperation({summary: "Update an Appointment.", description: "Roles: [Admin,Owner]"})
    @ApiParam({name: "appointmentId", example: "67810547cb30f8e35f989685"})
    acceptAppointment(@Param("appointmentId",ParseMongoIdPipe,AppointmentExistPipe) appointmentId: string){
        return this.appointmentService.accept(appointmentId);
    }

    @Patch(":appointmentId/reject")
    @Auth(AppointmentOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiOperation({summary: "Reject an Appointment.", description: "Roles: [Admin,Owner]"})
    @ApiParam({name: "appointmentId", example: "67810547cb30f8e35f989685"})
    rejectAppointment(@Param("appointmentId",ParseMongoIdPipe,AppointmentExistPipe) appointmentId: string){
        return this.appointmentService.reject(appointmentId);
    }
    
    @Patch(":appointmentId/cancel")
    @Auth(AppointmentOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiOperation({summary: "cancel an Appointment.", description: "Roles: [Admin,Owner]"})
    @ApiParam({name: "appointmentId", example: "67810547cb30f8e35f989685"})
    cancelAppointment(@Param("appointmentId",ParseMongoIdPipe,AppointmentExistPipe) appointmentId: string){
        return this.appointmentService.cancel(appointmentId);
    }

    @Delete(":appointmentId")
    @Auth(AppointmentOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiOperation({summary: "cancel an Appointment.", description: "Roles: [Admin,Owner]"})
    @ApiParam({name: "appointmentId", example: "67810547cb30f8e35f989685"})
    deleteAppointment(@Param("appointmentId",ParseMongoIdPipe,AppointmentExistPipe) appointmentId: string){
        return this.appointmentService.delete(appointmentId);
    }
}
