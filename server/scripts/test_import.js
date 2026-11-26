async function testImport() {
  const res = await fetch('http://localhost:5000/api/freelance/import-to-crm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gigId: 'gig-upwork-1' })
  });
  const data = await res.json();
  console.log('Import Result:', data.message);
}
testImport().catch(console.error);
