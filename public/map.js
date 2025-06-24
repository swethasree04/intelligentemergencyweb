const map = L.map('map').fitWorld();
let userMarker;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Show current location
map.locate({ setView: true, maxZoom: 16 });

map.on('locationfound', (e) => {
  const userLatLng = e.latlng;

  if (!userMarker) {
    userMarker = L.marker(userLatLng).addTo(map).bindPopup("You are here").openPopup();
  }

  // Fetch nearby hospitals from backend
  fetch(`/api/hospitals?lat=${userLatLng.lat}&lng=${userLatLng.lng}&radius=500`)
    .then(res => res.json())
    .then(hospitals => {
      hospitals.forEach(hospital => {
        const [lng, lat] = hospital.location.coordinates;
        const marker = L.marker([lat, lng], { icon: L.icon({ iconUrl: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', iconSize: [32, 32] }) })
          .addTo(map)
          .bindPopup(hospital.name)
          .on('click', () => {
            L.Routing.control({
              waypoints: [userLatLng, L.latLng(lat, lng)],
              routeWhileDragging: false
            }).addTo(map);
          });
      });
    });
});

map.on('locationerror', () => {
  alert("Location access denied.");
});
