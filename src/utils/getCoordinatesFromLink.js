import axios from "axios";

export async function getCoordsFromShortUrl(url) {

  // 3. Try extracting pattern: !3dLAT!4dLNG
  const p1 = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (p1) {
    return {
      lat: parseFloat(p1[1]),
      lng: parseFloat(p1[2]),
    };
  }

  // 4. Try extracting pattern: @LAT,LNG
  const p2 = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (p2) {
    return {
      lat: parseFloat(p2[1]),
      lng: parseFloat(p2[2]),
    };
  }

  throw new Error("Coordinates not found in the resolved URL");
}