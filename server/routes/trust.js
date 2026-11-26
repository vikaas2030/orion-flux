import express from 'express';
import {
  generateInstitutionalDossier,
  INSTITUTIONAL_CREDENTIALS,
  generateGuaranteeBond,
  verifyGuaranteeBondByNumber,
  ratifyDigitalAgreement
} from '../services/institutionalTrustEngine.js';

const router = express.Router();

// GET /api/trust/credentials — Public Institutional Trust Credentials
router.get('/credentials', (req, res) => {
  res.json({ success: true, credentials: INSTITUTIONAL_CREDENTIALS });
});

// POST /api/trust/ratify-agreement — Ratify Master Services Agreement with SHA-256 seal
router.post('/ratify-agreement', (req, res) => {
  try {
    const { dealId, clientName, company, designation, phone } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
    const result = ratifyDigitalAgreement({
      dealId,
      clientName,
      company,
      designation,
      phone,
      ipAddress
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/trust/dossier/:id — Generate Institutional Verification Dossier for Deal
router.get('/dossier/:id', (req, res) => {
  try {
    const { id } = req.params;
    const dossier = generateInstitutionalDossier(id);
    res.json(dossier);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/trust/guarantee-bond/:id — Generate Bank-Grade Zero-Fear Buyer Protection Bond
router.get('/guarantee-bond/:id', (req, res) => {
  try {
    const { id } = req.params;
    const bond = generateGuaranteeBond(id);
    res.json(bond);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/trust/verify-bond/:bondNumber — Public Cryptographic Verification of Bond
router.get('/verify-bond/:bondNumber', (req, res) => {
  try {
    const { bondNumber } = req.params;
    const verification = verifyGuaranteeBondByNumber(bondNumber);
    res.json(verification);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
