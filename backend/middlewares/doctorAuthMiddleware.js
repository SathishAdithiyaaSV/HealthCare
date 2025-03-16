import jwt from 'jsonwebtoken';
import Doctor from '../models/doctorModel.js';

const doctorAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your_secret_key'); // Replace with your secret key

        const doctor = await Doctor.findOne({ _id: decoded.id });
        if (!doctor) {
            throw new Error();
        }

        req.doctor = doctor;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export default doctorAuthMiddleware;