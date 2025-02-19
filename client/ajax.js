async function getUsers(page){
    const res = await fetch(`http://localhost:4000/api/user?limit=100&page=${page}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    })
}

async function getUserAppointments(){
    const res = await fetch("http://localhost:4000/api/appointment", {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
}

async function getDoctor(){
    const res = await fetch("http://localhost:4000/api/doctor/is-doctor", {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });
    const result = await res.json();
    if(result.status){
        return result.doctor;
    }else{
        return false;
    }
}

async function getDoctorApplication(){
    const user = await getUser();
    const res = await fetch(`http://localhost:4000/api/doctor-application/${user.id}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });
    
    if(res.status == 200){
        const data = await res.json();
        return data;
    }else{
        return false;
    }
}

async function createDoctorApplication(specialtyId){
    const {userId} = await getData();
    const res = await fetch(`http://localhost:4000/api/doctor-application/${userId}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("user-token")
        },
        body: JSON.stringify({specialtyId})
    });
    const data = await res.json();
    return data;
}

async function createPatientApplication(){
    const {userId} = await getData();
    const res = await fetch(`http://localhost:4000/api/patient-application/${userId}`, {
        method: "POST",
        headers: {
            Authorization: localStorage.getItem("user-token")
        },
    });
    const data = await res.json();
    
    return data;
}

async function getPatientApplication(){
    const user = await getUser();
    const res = await fetch(`http://localhost:4000/api/patient-application/${user.id}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });

   if(res.status == 200){
        const data = await res.json();
        return data;
   }
   return false;
}

async function getPatient(){
    const res = await fetch("http://localhost:4000/api/patient/is-patient", {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });
    const result = await res.json();
    if(result.status){
        return result.patient;
    }else{
        return false;
    }
}

async function getData(token) {
    const res = await fetch("http://localhost:4000/profile", {
        method: "GET",
        headers: {
            Authorization: token ?? localStorage.getItem("user-token")
        }
    });
    if(res.status == 401){
        window.location.replace("/login.html");
    }
    return await res.json();
}

async function getUser(){
    const {userId} = await getData();
    const res = await fetch(`http://localhost:4000/api/user/${userId}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });
    return await res.json();
}

async function getProfileImg(userId){
    const res = await fetch(`http://localhost:4000/api/user/${userId}/profile-img`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });
    return res.blob;
}

async function changePassword(oldPassword,newPassword){
    return fetch(`http://localhost:4000/api/user/change-password`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("user-token")
        },
        body: JSON.stringify({oldPassword, newPassword})
    });
}

async function getSpecialties() {
    return fetch(`http://localhost:4000/api/specialty`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });
}

async function findSpecialty(specialtyId) {
    const res = await fetch(`http://localhost:4000/api/specialty/${specialtyId}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });
    if(res.status == 302){
        return await res.json();
    }else{
        return false;
    }
}

async function getDocumentFile(filename){
    const res = await fetch(`http://localhost:4000/api/document/get-file/${filename}`, {
        method: "GET"
    });
    return res;
    
}

function updateDocumentData(documentId, data){
    return fetch(`http://localhost:4000/api/document/${documentId}`, {
        method: "PATCH",
        headers: {
            Authorization: localStorage.getItem("user-token"),
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
}

async function addNewDocument(applicationId, data, type) {
    const res = await fetch(`http://localhost:4000/api/${type}-application/add-document/${applicationId}`, {
        method: "POST",
        headers: {
            Authorization: localStorage.getItem("user-token"),
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return await res.json();
}

async function deleteDocument(documentId) {
    const res = await fetch(`http://localhost:4000/api/document/${documentId}`, {
        method: "DELETE",
        headers: {
            Authorization: localStorage.getItem("user-token")
        }
    });
    window.location.reload();
    return await res.json();                      
}
 
async function getDoctors(page,token){
    const res = await fetch(`http://localhost:4000/api/doctor?limit=100&page=${page}`, {
        method: "GET",
        headers: {
            Authorization: token ?? localStorage.getItem("admin-token")
        }
    });
    if(res.status == 302){
        const doctors = await res.json();
        return doctors;
    }
    return false;
}

async function getPatients(page,token){
    const res = await fetch(`http://localhost:4000/api/patient?limit=100&page=${page}`, {
        method: "GET",
        headers: {
            Authorization: token ?? localStorage.getItem("admin-token")
        }
    });
    if(res.status == 302){
        const doctors = await res.json();
        return doctors;
    }
    return false;
}

async function findUser(userId,token) {
    const res = await fetch(`http://localhost:4000/api/user/${userId}`, {
        method: "GET",
        headers: {
            Authorization: token
        }
    });
    if(res.status == 302){
        const user = await res.json();
        return user;
        
    }else{
        return false;
    }
}

async function getDoctorsApplications(page){
    const res = await fetch(`http://localhost:4000/api/doctor-application?limit=100&page=${page}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    });
    
    if(res.status == 401){
        console.log("No");
        window.location.replace("/admin-login.html")
    }
    return await res.json();
}

function acceptApplication(applicationId, type){
    return fetch(`http://localhost:4000/api/${type}-application/accept/${applicationId}`, {
        method: "PATCH",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    });
}

function rejectApplication(applicationId, type){
    return fetch(`http://localhost:4000/api/${type}-application/reject/${applicationId}`, {
        method: "PATCH",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    });
}

function deleteApplication(applicationId, type){
    return fetch(`http://localhost:4000/api/${type}-application/${applicationId}`, {
        method: "DELETE",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    });
}

async function getPatientsApplications(page){
    const res = await fetch(`http://localhost:4000/api/patient-application?limit=100&page=${page}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    });
    return await res.json();
}

function logout(){
    localStorage.clear();
    window.location.replace("/login.html");
}

async function doctorAppSearch(key){
    const res = await fetch(`http://localhost:4000/api/doctor-application/search/${key}`, {
        method: "HEAD",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    });
    console.log(await res.json());
    

    if(res.status == 200){
        return await res.json();
    }
    return false;
}

async function getDoctorAppointments(doctorId, token) {
    const res = await fetch(`http://localhost:4000/api/appointment/doctor-appointments/${doctorId}`, {
        method: "GET",
        headers: {
            Authorization: token
        }
    });
    if(res.status == 200){
        return await res.json();
    }else{
        alert(res.statusText);
        return false;
    }
}

async function findPatient(patientId, token) {
    const res = await fetch(`http://localhost:4000/api/patient/${patientId}`, {
        method: "GET",
        headers: {
            Authorization: token
        }
    });
    if(res.status == 302){
        const user = await res.json();
        return user;
        
    }else{
        return false;
    }
}

async function findDoctor(doctorId, token) {
    const res = await fetch(`http://localhost:4000/api/doctor/${doctorId}`, {
        method: "GET",
        headers: {
            Authorization: token
        }
    });
    if(res.status == 302){
        const user = await res.json();
        return user;
        
    }else{
        return false;
    }
}

async function acceptAppointment(appintmentId) {
    const res = await fetch(`http://localhost:4000/api/appointment/${appintmentId}/accept`, {
        method: "PATCH",
        headers: {
            Authorization: localStorage.getItem("doctor-token")
        }
    });
    console.log(res);
    
    if(res.status == 200){
        alert("appointment accepted successfuly!")
        return true;
    }else{
        return false;
    }
}

async function getPatientAppointments(patientId, token) {
    const res = await fetch(`http://localhost:4000/api/appointment/patient-appointments/${patientId}`, {
        method: "GET",
        headers: {
            Authorization: token
        }
    });
    if(res.status == 200){
        return await res.json();
    }else{
        alert(res.statusText);
        return false;
    }
}

async function findDoctorApplication(userId, token){
    const res = await fetch(`http://localhost:4000/api/doctor-application/${userId}`,{
        method: "GET",
        headers: {
            Authorization: token
        }
    });
    if(res.status == 200){
        return await res.json();
    }else {
        return false;
    }
}

async function findPatientApplication(userId, token){
    const res = await fetch(`http://localhost:4000/api/patient-application/${userId}`,{
        method: "GET",
        headers: {
            Authorization: token
        }
    });
    if(res.status == 200){
        return await res.json();
    }else {
        return false;
    }
}

async function createAppointment({patientId, doctorId, startTime, periodInMinutes}){
    const res = await fetch(`http://localhost:4000/api/appointment`,{
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("patient-token")
        },
        body: JSON.stringify({patientId, doctorId, startTime, periodInMinutes})
    });

    if(res.status == 201){
        alert("appointment is made, wait for doctor to accept.");
        window.location.reload()
    }else{
        const data = await res.json();
        alert(data.message)
    }
}

async function updateAppointmentAjax({startTime, periodInMinutes, appointmentId}, token){
    const res = await fetch(`http://localhost:4000/api/appointment/${appointmentId}`,{
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({startTime, periodInMinutes})
    });

    if(res.status == 200){
        alert("appointment is updated successfuly!");
        window.location.reload()
    }else{
        const data = await res.json();
        alert(data.message)
    }
}

async function cancelAppointmentAjax(appointmentId, token){
    const res = await fetch(`http://localhost:4000/api/appointment/${appointmentId}/cancel`,{
        method: "PATCH",
        headers: {
            Authorization: token
        }
    });

    if(res.status == 200){
        alert("appointment is canceled successfuly!");
        window.location.reload()
    }else{
        const data = await res.json();
        alert(data.message)
    }
}

async function rejectAppointmentAjax(appointmentId, token){
    const res = await fetch(`http://localhost:4000/api/appointment/${appointmentId}/reject`,{
        method: "PATCH",
        headers: {
            Authorization: token
        }
    });

    if(res.status == 200){
        alert("appointment is rejected successfuly!");
        window.location.reload()
    }else{
        const data = await res.json();
        alert(data.message)
    }
}

async function addFollowupAjax({appointmentId, startTime, periodInMinutes}, token){
    const res = await fetch(`http://localhost:4000/api/appointment/${appointmentId}/add-followup`,{
        method: "POST",
        headers: {
            Authorization: token,
            "Content-type": "application/json"
        },
        body: JSON.stringify({appointmentId, startTime, periodInMinutes})
    });

    if(res.status == 200){
        alert("followup added successfuly!");
        window.location.reload()
    }else{
        const data = await res.json();
        alert(data.message)
    }
}

async function deleteDoctorAjax(doctorId) {
    const res = await fetch(`http://localhost:4000/api/doctor/${doctorId}`,{
        method: "DELETE",
        headers: {
            Authorization: localStorage.getItem("admin-token"),
        }
    });
    if(res.status == 204){
        alert("doctor deleted successfuly!");
        window.location.reload()
    }else{
        const data = await res.json();
        alert(data)
    }
}

async function getDoctorApplicationForAdmin(userId){
    const res = await fetch(`http://localhost:4000/api/doctor-application/${userId}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    });
    
    if(res.status == 200){
        const data = await res.json();
        return data;
    }else{
        return false;
    }
}

async function getPatientApplicationForAdmin(userId){
    const res = await fetch(`http://localhost:4000/api/patient-application/${userId}`, {
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("admin-token")
        }
    });
    
    if(res.status == 200){
        const data = await res.json();
        return data;
    }else{
        return false;
    }
}