async function test() {
  try {
    const query = `[out:json][timeout:15];(node["contact:phone"](28.45,77.0,28.75,77.35);node["phone"](28.45,77.0,28.75,77.35););out body 5;`;
    const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    const data = await res.json();
    console.log(`Found ${data.elements.length} nodes:`);
    data.elements.forEach(el => {
      console.log({
        name: el.tags.name || 'Local Business',
        phone: el.tags.phone || el.tags['contact:phone'] || el.tags['contact:mobile'],
        type: el.tags.shop || el.tags.amenity || el.tags.office || 'Business',
        city: el.tags['addr:city'] || 'Delhi NCR'
      });
    });
  } catch (err) {
    console.error('Fetch err:', err.message);
  }
}
test();
