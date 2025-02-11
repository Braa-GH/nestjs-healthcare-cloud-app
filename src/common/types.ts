export type UserIdentifiers = {
    id?: string;
    email?: string
}

export type AdminIdentifiers = {
    id?: string;
    userId?: string
}

export type PatientIdentifiers = {
    id?: string;
    userId?: string
}

export type DoctorIdentifiers = {
    id?: string;
    userId?: string
}
export type SpecialtyIdentifiers = {
    id?: string,
    name?: string
}

export type PatientAppIdentifiers = {
    _id?: string,
    userId?: string
}

export type DoctorAppIdentifiers = {
    _id?: string,
    userId?: string
}

export type AppointmentIdentifiers = {
    _id?: string,
    patientId?: string,
    doctorId?: string
}

export type AppointmentsIdentifiers = {
    patientId?: string,
    doctorId?: string,
    ignoreFollowups?: boolean
}

export type EmailOptions = {
    to: string,
    subject: string,
    text: string
}