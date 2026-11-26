import dotenv from 'dotenv';
dotenv.config();
import { getTransporter } from '../services/emailDispatcher.js';

async function testGmail() {
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_PASS length:', (process.env.GMAIL_APP_PASSWORD || '').length);
  const transporter = getTransporter();
  if (!transporter) {
    console.error('No transporter returned!');
    return;
  }
  console.log('Testing SMTP connection with Gmail...');
  try {
    const verified = await transporter.verify();
    console.log('✅ SMTP Connection VERIFIED! Gmail credentials are VALID:', verified);
  } catch (err) {
    console.error('❌ SMTP Connection FAILED:', err.message);
  }
}

testGmail();
