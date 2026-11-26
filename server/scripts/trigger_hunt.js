async function trigger() {
  const payload = {
    cities: ["Delhi", "Bengaluru", "London", "Dubai", "Noida", "Bareilly"],
    professions: ["dentist", "doctor", "real_estate", "web_software"],
    limit: 2
  };
  const res = await fetch('http://localhost:5000/api/real-world/auto-hunt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log('Hunter Result:', data.message, 'Added count:', data.count);
}
trigger().catch(console.error);
