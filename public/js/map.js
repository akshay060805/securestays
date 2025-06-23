var map = tt.map({
  key: mapKey,
  container: "map",
  center:coordinates,
  zoom:8
})

// Add a marker
const marker = new tt.Marker()
  .setLngLat(coordinates) // [longitude, latitude]
  .addTo(map);

const popup = new tt.Popup({ offset: 35 })
  .setText('Your Destination!')
  .addTo(map);

marker.setPopup(popup);