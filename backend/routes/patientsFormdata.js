import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formPath = path.join(__dirname, '../data/patients.json');

//form-patients
router.post('/addDetails', (req, res) => {
    const newPatients = req.body;

    const existingData = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    //generate id
    const maxId = existingData.length ? Math.max(...existingData.map(p => Number(p.id))) : 0;
    newPatients.id = maxId + 1;
    newPatients.createdAt = newPatients.createdAt || new Date().toISOString();

    existingData.push(newPatients);

    fs.writeFileSync(formPath, JSON.stringify(existingData, null, 2));

    res.json(newPatients);
    
})

//showAllPatients 
router.get('/', (req, res)=> {
    console.log("Reading from:", formPath);

    const patients = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    console.log("File contains:", patients.length, "records");

    res.json(patients);
})

//getById
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const patients = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const patient = patients.find(p => String(p.id) === id)

    if(!patient) {
        return res.status(404).json({message: 'Patient not found'})
    }
    res.json(patient)
})


// update patient
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedPatient = req.body;

  const patients = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

  const index = patients.findIndex(p => String(p.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  // replace record
  patients[index] = updatedPatient;

  fs.writeFileSync(formPath, JSON.stringify(patients, null, 2));

  res.json(updatedPatient);
});


// delete patient
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const patients = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const index = patients.findIndex(p => String(p.id) === id);

    if(index === -1) {
        return res.status(404).json({message: 'Patient not found'})
    }

    const deletedPatient = patients.splice(index, 1);

    fs.writeFileSync(formPath, JSON.stringify(patients, null, 2));
    res.json({message: 'Patient deleted successfully', patient: deletedPatient[0]})
})

export default router;
