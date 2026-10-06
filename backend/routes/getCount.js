import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const patientDataPath = path.resolve('data/patients.json');
const doctorDataPath = path.resolve('data/doctors.json');
const appointmentDataPath = path.resolve('data/appointment.json');
const departmentDataPath = path.resolve('data/department.json');
const staffDataPath = path.resolve('data/staff.json');

router.get('/', (req, res) => {

    let data = {};

    // Read total patients count
    const patientData = JSON.parse(fs.readFileSync(patientDataPath, 'utf-8'));
    data.totalPatients = patientData.length;

    // Read total doctors count
    const doctorData = JSON.parse(fs.readFileSync(doctorDataPath, 'utf-8'));
    data.totalDoctors = doctorData.length;
    
    // Read total appointments count
    const appointmentData = JSON.parse(fs.readFileSync(appointmentDataPath, 'utf-8'));
    data.totalAppointments = appointmentData.length;

    //read total departments count
    const departmentData = JSON.parse(fs.readFileSync(departmentDataPath, 'utf-8'));
    data.totalDepartments = departmentData.length;

    //read total staff count
    const staffData = JSON.parse(fs.readFileSync(staffDataPath, 'utf-8'));
    data.totalStaff = staffData.length;

    res.json(data);
})


export default router;