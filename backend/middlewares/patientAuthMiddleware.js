import jwt from 'jsonwebtoken';
import Patient from '../models/patientModel.js';

const patientAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your_secret_key'); // Replace with your secret key

        const patient = await Patient.findOne({ _id: decoded.id });
        if (!patient) {
            throw new Error();
        }

        req.patient = patient;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export default patientAuthMiddleware;