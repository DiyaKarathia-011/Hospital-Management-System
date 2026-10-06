import express from 'express';
import fs from 'fs';
import path from 'path';
import { json } from 'stream/consumers';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const formPath = path.join(__dirname, '../data/staff.json');

//form-staff
router.post('/addStaffDetails', (req, res) => {
    const newStaff = req.body;

    const existingData = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    //generate id
    const maxId = existingData.length ? Math.max(...existingData.map(p => Number(p.id))) : 0;
    newStaff.id = maxId + 1;

    existingData.push(newStaff);

    fs.writeFileSync(formPath, JSON.stringify(existingData, null, 2));

    res.json(newStaff);
})

//get-AllStaffList
router.get('/list/:role', (req, res) => {
    const staffCount = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const count = {
        Nurse: staffCount.filter(s => s.role === 'Nurse').length,
        Receptionist: staffCount.filter(s => s.role === 'Receptionist').length,
        Pharmacist: staffCount.filter(s => s.role === 'Pharmacist').length,
        LabTechnician: staffCount.filter(s => s.role === 'Lab Technician').length,
        Security: staffCount.filter(s => s.role === 'Security').length,
        Peon: staffCount.filter(s => s.role === 'Peon').length,
    }

    res.json(count);
})

//get all staff
router.get('/', (req, res) => {
    const staffData = JSON.parse(fs.readFileSync(formPath, 'utf-8'));
    res.json(staffData);
})

//get staffList role based 
router.get('/role/:role', (req, res) => {
    const role = req.params.role;

    const staffData = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const filteredStaff = staffData.filter(s => s.role === role);

    res.json(filteredStaff);
})

//getById 
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const staff = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const findStaff = staff.find(s => String(id) === id)

    if(!staff) {
        return res.status(404).json({message: 'staff not found'})
    }

    res.json(findStaff)
})

//update staff
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedStaff = req.body;

    const staff = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const index = staff.findIndex(s => String(s.id) === id);

    if(index === -1) {
        return res.status(404).json({ message: 'staff not found'});
    }

    //replace record
    staff[index] = updatedStaff;

    fs.writeFileSync(formPath, JSON.stringify(staff, null, 2));

    res.json(updatedStaff);
})

//delete staff
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const staff = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const index = staff.findIndex(s => String(s.id) === id);

    if(index === -1) {
        return res.status(404).json({message:'staff not found'});
    }

    const deletedStaff = staff.splice(index, 1);    
    fs.writeFileSync(formPath, json.stringify(staff, null, 2));

    res.json({message:'Staff deleted successfully', staff: deletedStaff[0]})
})

export default router;
