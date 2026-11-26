async function testDeliver() {
  const res = await fetch('http://localhost:5000/api/projects/2001/deliver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  console.log('Delivery Result:', data.message);
  console.log('Portal URL:', data.portalUrl);
  console.log('Notification Text:\n' + data.notificationMessage);
}
testDeliver().catch(console.error);
