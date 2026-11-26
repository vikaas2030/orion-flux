import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getClientDeliverables, packageAllActiveDeals, generateClientAssetPackage } from '../services/assetPackagingEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DELIVERABLES_DIR = path.resolve(__dirname, '../../deliverables');

const router = express.Router();

// GET /api/deliverables/:code — Fetch manifest
router.get('/:code', (req, res) => {
  try {
    const { code } = req.params;
    const manifest = getClientDeliverables(code);
    res.json(manifest);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// GET /api/deliverables/:code/download/:fileName — Download deliverable file
router.get('/:code/download/:fileName', (req, res) => {
  try {
    const { code, fileName } = req.params;
    const filePath = path.join(DELIVERABLES_DIR, code.toLowerCase(), fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: true, message: 'File not found' });
    }

    res.download(filePath, fileName);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/deliverables/package-all — Package deliverables for all active clients
router.post('/package-all', (req, res) => {
  try {
    const result = packageAllActiveDeals();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// POST /api/deliverables/:code/generate — Generate package for single client
router.post('/:code/generate', (req, res) => {
  try {
    const { code } = req.params;
    const result = generateClientAssetPackage(code);
    res.json({ success: true, manifest: result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

export default router;
