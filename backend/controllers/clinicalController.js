import axios from "axios";

const FHIR_BASE_URL = 'https://hapi.fhir.org/baseR4';

export const getConditions = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${FHIR_BASE_URL}/Condition?subject=Patient/${id}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
export const getObservations = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${FHIR_BASE_URL}/Observation?subject=Patient/${id}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addCondition = async (req, res) => {
    try {
        const patientData = req.body;
        const response = await axios.post(`${FHIR_BASE_URL}/Condition`, patientData);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };

  export const addObservation = async (req, res) => {
    try {
        const patientData = req.body;
        const response = await axios.post(`${FHIR_BASE_URL}/Observation`, patientData);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };