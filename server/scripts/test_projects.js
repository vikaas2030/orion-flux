async function test() {
  const res = await fetch('http://localhost:5000/api/projects');
  const data = await res.json();
  console.log('Total Real Projects in QA Engine:', data.count);
  data.projects.forEach((p, i) => {
    console.log(`${i+1}. [${p.status.toUpperCase()}] ${p.title} | Client: ${p.client} | QA Score: ${p.qaScore}% | Value: ${p.currency === 'USD' ? '$' : '₹'}${p.value}`);
  });
}
test().catch(console.error);
