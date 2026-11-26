// ═════════════════════════════════════════════════════════════════════
//  WHATSAPP VOICE NOTE STUDIO & SCRIPT SYNTHESIZER ENGINE
//  95% Listen Rate: High-Conversion Personalized Voice Pitches
//  Generates natural, objection-annihilating spoken audio scripts
//  in Hindi, Hinglish, and English for instant WhatsApp closing.
// ═════════════════════════════════════════════════════════════════════

import { getDB } from '../config/database.js';
import { getPublicBaseUrl } from './publicAccess.js';

export function getVoiceStudioLeads() {
  const db = getDB();
  const leads = db.data.leads || [];

  return leads
    .filter(l => l.phone && l.phone.length > 5)
    .slice(0, 30)
    .map(lead => {
      const isIndia = lead.country === 'India';
      const cleanPhone = (lead.rawPhone || lead.phone || '').replace(/[^0-9]/g, '');
      const advanceStr = isIndia ? `₹${(lead.pricingAdvance || 2500).toLocaleString()}` : `$${lead.pricingAdvance || 200}`;
      const totalStr = isIndia ? `₹${(lead.pricingTotal || 6000).toLocaleString()}` : `$${lead.pricingTotal || 500}`;
      const company = lead.company || lead.name || 'Business Partner';
      const city = lead.city || 'your city';
      const industry = lead.industry || 'Business Automation';

      const clientSlug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const portalUrl = `${getPublicBaseUrl()}/portal/${clientSlug}`;

      const scriptHinglish = `Namaste ${company} team! Main Vikas bol raha hoon ORION FLUX Studio se. Maine dekha ki ${city} me aapke ${industry} business par kafi customer enquiries aati hain, lekin manual response ki wajah se kai valuable clients drop ho jate hain. Humne aapke liye ek 24/7 automated WhatsApp intake assistant aur promotional motion video reels system design kiya hai, jisse inquiry aate hi 60 second me instant response mil jata hai. Iska total fee flat ${totalStr} hai bina kisi extra tax ke, aur initial 50% milestone advance token sirf ${advanceStr} hai. Maine aapke liye ek private live production portal taiyar kiya hai. Kripya niche diye link par click karke ise live inspect karein. Dhanyawad!`;

      const scriptHindi = `नमस्ते ${company} टीम! मैं विकास बोल रहा हूँ ORION FLUX स्टूडियो से। मैंने देखा कि ${city} में आपके ${industry} बिजनेस पर काफी कस्टमर इन्क्वायरी आती हैं, लेकिन देर से जवाब मिलने की वजह से कई ग्राहक छूट जाते हैं। हमने आपके लिए 24/7 ऑटोमेटेड व्हाट्सएप असिस्टेंट तैयार किया है जो हर इन्क्वायरी पर 60 सेकंड में जवाब देता है। इसका कुल खर्च बिना किसी अतिरिक्त टैक्स के फ्लैट ${totalStr} है, और 50% एडवांस टोकन सिर्फ ${advanceStr} है। मैंने आपके लिए प्राइवेट लाइव प्रोडक्शन पोर्टल तैयार किया है। कृपया नीचे दिए लिंक पर इसे लाइव चेक करें। धन्यवाद!`;

      const scriptEnglish = `Hello ${company} team! This is Vikas from ORION FLUX Studio. We noticed your business in ${city} has great customer traction in ${industry}, but manual response delays cause valuable prospects to slip away. We have built an automated 24/7 WhatsApp intake assistant and 4K promotional reels engine tailored specifically for ${company}. Total investment is a flat ${totalStr} with zero extra taxes, and a 50% milestone advance of ${advanceStr}. Your private live staging portal is ready. Please check the link below to inspect your deliverables. Best regards!`;

      const whatsappText = `नमस्ते ${company}! मैंने आपके लिए 30-सेकंड का पर्सनल वॉयस नोट और प्राइवेट लाइव क्लाइंट पोर्टल तैयार किया है: ${portalUrl}\n\n50% टोकन एडवांस (${advanceStr}) पर आज ही अपना सिस्टम लाइव कराएं (UPI: 9690973030@ibl).`;

      return {
        id: lead.id,
        company,
        phone: lead.phone,
        cleanPhone,
        city,
        industry,
        country: lead.country,
        currency: lead.currency || 'INR',
        advanceStr,
        totalStr,
        scriptHinglish,
        scriptHindi,
        scriptEnglish,
        whatsappText,
        whatsappUrl: cleanPhone ? `https://web.whatsapp.com/send?phone=${cleanPhone.startsWith('91') || cleanPhone.length === 10 ? (cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone) : cleanPhone}&text=${encodeURIComponent(whatsappText)}` : ''
      };
    });
}

export function logVoiceNoteDispatched(leadId, company, language = 'Hinglish') {
  const db = getDB();
  if (!db.data.activities) db.data.activities = [];

  const activity = {
    id: `act-voice-${Date.now()}`,
    type: 'voice_note_dispatched',
    title: `🎙️ WhatsApp Voice Note Staged & Shared: ${company}`,
    description: `Language: ${language} | High-conversion audio note & live staging link delivered to client queue.`,
    timestamp: new Date().toISOString()
  };

  db.data.activities.unshift(activity);
  db.save();

  return { success: true, activity };
}
