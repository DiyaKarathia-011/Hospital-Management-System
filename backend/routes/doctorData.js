import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formPath = path.join(__dirname, '../data/doctors.json');

//form-doctors
router.post('/addDoctorDetails', (req, res) => {
    const newDoctor = req.body;

    const existingData = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    //generate id
    const maxId = existingData.length ? Math.max(...existingData.map(d => Number(d.id))) : 0;
    newDoctor.id = maxId + 1;

    existingData.push(newDoctor);

    fs.writeFileSync(formPath, JSON.stringify(existingData, null, 2));

    res.json(newDoctor);

})

//get-Alldoctors
router.get('/', (req, res)=> {
    const doctors = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    res.json(doctors);
})

//get By id
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const doctor = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const doc = doctor.find(d => String(d.id) === id);

    if(!doc) {
        return res.status(404).json({message:'Doctor not Found!'});
    }

    res.json(doc);
})

//update doctor
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedDoctor = req.body;

    const doctor = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const index = doctor.findIndex(d => String(d.id) === id)

    if(index === -1) {
        return res.status(404).json({message: 'Doctor not Found!'})
    }

    doctor[index] = updatedDoctor;

    fs.writeFileSync(formPath, JSON.stringify(doctor, null, 2))

    res.json(updatedDoctor)
})

//delete Doctor
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const doctor = JSON.parse(fs.readFileSync(formPath, 'utf-8'))

    const index = doctor.findIndex(d => String(d.id) === id)

    if(index === -1) {
        return res.status(404).json({message: 'Doctor not found!'})
    }

    const deletedDoctor = doctor.splice(index, 1);

    fs.writeFileSync(formPath, JSON.stringify(doctor, null, 2))
    res.json({message: 'Patient deleted successfully', patient: deletedPatient[0]})
})

export default router;   