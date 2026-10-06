import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formPath = path.join(__dirname, '../data/department.json');

//add-department
router.post('/addDepartment', (req, res) => {
    const newData = req.body;

    const existingData = JSON.parse(fs.readFileSync(formPath, 'utf-8'));

    //generateId
    const maxId = existingData.length ? Math.max(...existingData.map(d => Number(d.id))) : 0;
    newData.id = maxId + 1;

    existingData.push(newData);

    fs.writeFileSync(formPath, JSON.stringify(existingData, null, 2))
    res.json(newData);
})

router.get('/', (req, res) => {
    const data = JSON.parse(fs.readFileSync(formPath, 'utf-8'));
    res.json(data);
})

export default router;


