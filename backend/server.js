import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from 'multer';
import * as Agora from "agora-access-token"; // Agora SDK for token generation
import Doctor from "./models/doctorModel.js"
import Appointment from "./models/appointmentModel.js"
import Patient from "./models/patientModel.js"
import Admin from "./models/adminModel.js";
import Report from "./models/reportModel.js";
import Prescription from "./models/prescriptionModel.js";
import patientAuthMiddleware from "./middlewares/patientAuthMiddleware.js";
import doctorAuthMiddleware from "./middlewares/doctorAuthMiddleware.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pkg from 'agora-access-token';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

dotenv.config();

const APP_ID = "252142d27f2a41b083a166b76c41d881";
const APP_CERTIFICATE = "c8970cde26054522ac9ead01ea602ba1";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const { RtcTokenBuilder, RtcRole } = pkg;

const app = express();
const PORT = process.env.PORT || 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("MongoDB connection error:", err));


// Generate Agora token
app.post("/api/generate-token", (req, res) => {
  const { channelName } = req.body;

  if (!channelName) {
    return res.status(400).json({ message: "Channel name is required" });
  }

  const appId = "252142d27f2a41b083a166b76c41d881";
  const appCertificate = "c8970cde26054522ac9ead01ea602ba1";
  const expirationTimeInSeconds = 3600;

  const token = Agora.RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    0, // UID
    Agora.RtcRole.PUBLISHER,
    Math.floor(Date.now() / 1000) + expirationTimeInSeconds
  );

  res.json({ token, channelName });
});


app.post("/generateToken", (req, res) => {
  const { channelName, uid, role } = req.body;

  if (!channelName || !uid) {
    return res.status(400).send("Channel name and UID are required.");
  }

  const expirationTimeInSeconds = 3600;
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpirationTime = currentTime + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
    privilegeExpirationTime
  );

  res.json({ token });
});

// API Routes
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors", error: err });
  }
});

app.get("/api/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors", error: err });
  }
});

app.get("/api/patient", patientAuthMiddleware, async (req, res) => {
  try {
    res.json(req.patient);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors", error: err });
  }
});

app.post("/api/patient/update", patientAuthMiddleware, async (req, res) => {
  try {
    const updatedPatient = await Patient.updateOne(
      { _id: req.patient._id },  // Filter condition (find the patient by ID)
      { $set: { name: req.body.name, email: req.body.email } }  // Update values
    );

    if (updatedPatient.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes were made" });
    }

    res.json({ message: "Patient updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating patient", error: err });
  }
});


app.post("/api/appointments", patientAuthMiddleware, async (req, res) => {
  try {
    const { doctorId, doctorName, date, time } = req.body;
    const doctor = await Doctor.findById(doctorId);
    const appointment = new Appointment({ doctorId: doctor._id, doctorName, patientId: req.patient._id, patientName: req.patient.name, date, time });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Error scheduling appointment", error: err });
  }
});

app.get("/api/patient/appointments", patientAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({patientId: req.patient._id});
    res.status(201).json({appointments});
  } catch (err) {
    res.status(500).json({ message: "Error scheduling appointment", error: err });
  }
});

app.post("/api/patient/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      const patient = await Patient.findOne({ email });
      if (!patient) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: patient._id, role: 'patient' }, 'your_secret_key', { expiresIn: '3h' });

      res.json({ token });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.post("/api/doctor/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: doctor._id, role: 'doctor' }, 'your_secret_key', { expiresIn: '3h' });

      res.json({ token });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: admin._id, role: 'admin' }, 'your_secret_key', { expiresIn: '3h' });

      res.json({ token });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/signup", async (req, res) => {
  try {
    let user_username = await Admin.findOne({ name: req.body.name });
    let user_email = await Admin.findOne({ email: req.body.email });
    if (user_email) {
        return res.status(403).json({ message: 'User already exists, please log in' });
    }
    else if (user_username) {
        return res.status(403).json({ message: 'Username already exists, try using a different one' });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();
    return res.status(201).json({ message: 'Admin created successfully' });
} catch (error) {
    return res.status(500).json({ error: error.message });
}
});

app.post("/api/patient/register", async (req, res) => {
  try {
    let user_username = await Patient.findOne({ name: req.body.name });
    let user_email = await Patient.findOne({ email: req.body.email });
    if (user_email) {
        return res.status(403).json({ message: 'User already exists, please log in' });
    }
    else if (user_username) {
        return res.status(403).json({ message: 'Username already exists, try using a different one' });
    }

    const { name, email, age, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let patient = new Patient({ name, email, age, password: hashedPassword });
    await patient.save();
    return res.status(201).json({ message: 'Patient created successfully' });
} catch (error) {
    return res.status(500).json({ error: error.message });
}
});

app.post("/api/doctor/register", async (req, res) => {
  try {
    let user_username = await Doctor.findOne({ name: req.body.name });
    let user_email = await Doctor.findOne({ email: req.body.email });
    if (user_email) {
        return res.status(403).json({ message: 'User already exists, please log in' });
    }
    else if (user_username) {
        return res.status(403).json({ message: 'Username already exists, try using a different one' });
    }

    const { name, email, password, speciality } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let doctor = new Doctor({ name, email, password: hashedPassword, speciality });
    await doctor.save();
    return res.status(201).json({ message: 'Doctor created successfully' });
} catch (error) {
    return res.status(500).json({ error: error.message });
}
});

app.post("/api/appointments/schedule", async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const appointment = new Appointment({ doctorId, date, time });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Error scheduling appointment", error: err });
  }
});

// Endpoint for uploading a PDF
app.post('/api/report/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const patient = await Patient.findById(req.body.patientId);

    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    const newReport = new Report({         
      name: req.body.name,
      pdf: req.file.buffer,
      patientId: patient._id,
      date: req.body.date,
      //contentType: req.file.mimetype,
    });


    const rprt = await newReport.save();
    //console.log(rprt);
    res.status(200).send({ message: 'File uploaded and saved successfully!', id: newReport._id });
  } catch (error) {
    res.status(500).send('Error uploading the file');
  }
});

app.get('/api/getAppointments', doctorAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.doctor._id});
    res.status(200).send({appointments: appointments});
  } catch (error) {
    res.status(500).send('Error retrieving the appointments');
  }
});

app.get('/api/getReports', patientAuthMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.patient._id});
    res.status(200).send({reports: reports});
  } catch (error) {
    res.status(500).send('Error retrieving the reports');
  }
});

app.get('/api/doctor/getReports', doctorAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.doctor._id});
    const reports = await Report.find({ patientId: appointments.map(a => a.patientId) });
    res.status(200).send({reports: reports});
  } catch (error) {
    res.status(500).send('Error retrieving the reports');
  }
});

app.get('/api/patient/getPrescriptions', patientAuthMiddleware, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.patient._id});
    res.status(200).send({prescriptions});
  } catch (error) {
    res.status(500).send('Error retrieving the reports');
  }
});

app.get('/api/getPresciptions/:patientId', doctorAuthMiddleware, async (req, res) => {
  try {
    const presciptions = await Prescription.find({ patientId: req.params.patientId });
    res.status(200).send({presciptions});
  } catch (error) {
    res.status(500).send('Error retrieving the reports');
  }
});

app.get('/api/getHistory/:patientId', doctorAuthMiddleware, async (req, res) => {
  try {
    const presciptions = await Prescription.find({ patientId: req.params.patientId });
    const schema = {
      description: "Patient history record",
      type: SchemaType.OBJECT,
      properties: {
        patientHistory: {
          type: SchemaType.STRING,
          description: "History of the patient",
          nullable: false,
        },
      },
      required: ["patientHistory"],
    };
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    
    const result = await model.generateContent(
      `Give the patient history in a paragraph using the prescriptions of the patient: ${JSON.stringify(presciptions)}`,
    );
    console.log(result.response.text());
    res.status(200).send(JSON.parse(result.response.text()));
  } catch (error) {
    res.status(500).send('Error retrieving the reports');
  }
});

app.post("/api/patient/addPrescription", doctorAuthMiddleware, async (req, res) => {
  try {
    const { illness, patientId, medications } = req.body;
    const doctorId = req.doctor._id;

    // if (!illness || !doctorId || !doctorName || !patientId || !patientName || !medications || !Array.isArray(medications)) {
    //   return res.status(400).json({ error: "All fields are required, and medications must be an array." });
    // }

    const prescription = new Prescription({
      illness,
      doctorId,
      patientId,
      medications,
    });

    await prescription.save();
    res.status(201).json({ message: "Prescription added successfully", prescription });
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/patient/latestPrescription", patientAuthMiddleware, async (req, res) => {
  try {
    console.log(req);
      const { patientId } = req.patient._id;
      const latestPrescription = await Prescription.find({ patientId })

      if (!latestPrescription) {
          return res.status(404).json({ message: "No prescription found" });
      }

      res.json({ latestPrescription });
  } catch (error) {
      console.error("Error fetching latest prescription:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint for downloading a PDF by ID
app.get('api/report/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).send('Report not found');
    }

    res.contentType(report.contentType);
    res.send(report.pdf);
  } catch (error) {
    res.status(500).send('Error retrieving the report');
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
