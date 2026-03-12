/**
 * Returns true if the value is a valid [lat, lng] tuple (both numbers, not NaN).
 * Use before passing positions to Leaflet to avoid "Cannot read properties of null (reading 'lat')".
 */
export function isValidLatLng(
  position: unknown,
): position is [number, number] {
  return (
    Array.isArray(position) &&
    position.length >= 2 &&
    typeof position[0] === "number" &&
    typeof position[1] === "number" &&
    !Number.isNaN(position[0]) &&
    !Number.isNaN(position[1])
  );
}
