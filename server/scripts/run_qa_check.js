async function testQA() {
  const res = await fetch('http://localhost:5000/api/projects/2001/run-4layer-qa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  console.log('QA Result:', data.message);
  console.log('Certificate:', data.certificateId);
  console.log('Layers:', Object.keys(data.project.layers).map(k => `${data.project.layers[k].name}: ${data.project.layers[k].passed ? 'PASSED (100%)' : 'FAILED'}`));
}
testQA().catch(console.error);
