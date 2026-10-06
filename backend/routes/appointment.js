import express from 'express';
import fs from 'fs';
import path from 'path';
import { stringify } from 'querystring';
import { json } from 'stream/consumers';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const formPath = path.join(__dirname, '../data/appointment.json');

//create appointment
router.post('/addAppointment', (req, res) => {

  const newAppointment = req.body;

  const data = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

  const maxId = data.length 
  ? Math.max(...data.map(a => Number(a.id) || 0)) 
  : 0;

  newAppointment.id = maxId + 1;

  data.push(newAppointment);

  fs.writeFileSync(formPath, JSON.stringify(data, null, 2));

  res.json(newAppointment);
});

//get All appointments
router.get('/', (req, res) => {
    try{
        const data = JSON.parse(fs.readFileSync(formPath, 'utf-8'));
        res.json(data);
    } catch (err) {
        return res.status(505).json({message:'Error reading appointments'})
    }
})

//update status
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const appointments = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const index = appointments.findIndex(a => String(a.id) === id);

    if(index === -1) {
        return res.status(404).json({message:'Appointment not found'})
    }

    //update full object 
    appointments[index] = {...appointments[index], ...updatedData}

    fs.writeFileSync(formPath, JSON.stringify(appointments, null, 2));
    res.json({message:'Updated successfully', data:appointments[index]})
})

//get By ID
router.get('/:id', (req, res) => {
    const id = req.params.id;

    const appointment = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    const appoint = appointment.find( m => String(m.id) === id);

    if(!appoint) {
        return res.status(404).json({message: 'Appointment not found'})
    }

    res.json(appoint)
})


export default router;