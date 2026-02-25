export async function getCoordinates(location: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
  );

  const data = await response.json();

  if (!data.length) {
    throw new Error('Location not found');
  }

  return {
    location: data[0].display_name,
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
  };
}
