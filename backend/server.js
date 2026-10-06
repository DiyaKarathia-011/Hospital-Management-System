import express from 'express';
import cors from 'cors';

import getCountRoutes from './routes/getCount.js';
import patientsFormdataRoutes from './routes/patientsFormdata.js';
import doctorDataRoutes from './routes/doctorData.js';
import staffFormdataRoutes from './routes/staffFormdata.js';
import appointmentRoutes from './routes/appointment.js';
import departmentRoutes from './routes/department.js';

const app = express();
app.use(cors());

const PORT = 3000;
app.use(express.json());

app.use('/dashboard', getCountRoutes);
app.use('/patients', patientsFormdataRoutes);
app.use('/doctors', doctorDataRoutes);
app.use('/staff', staffFormdataRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/department', departmentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})