export const API_ROOMS_ENDPOINT = "/api/rooms";
export const API_USER_ENDPOINT = "/api/userOption";
export const API_AVAILABILITY_ENDPOINT = "/api/userAvailability";

// export const API_ROOMS_ENDPOINT = "http://localhost:8080/rooms";
// export const API_USER_ENDPOINT = "http://localhost:8080/userOption";
// export const API_AVAILABILITY_ENDPOINT =
//   "http://localhost:8080/userAvailability";

export function getRoomURL(roomID: String) {
  return "https://whenareufree.com/create-user?roomID=" + roomID;
}

export const autoSuggestions = [
  "bar",
  "club",
  "spoons",
  "dinner",
  "library",
  "cafe",
  "karaoke night",
  "bowling",
  "cinema",
  "escape room",
  "pub quiz night",
  "bottomless brunch",
  "house party",
  "theatre show",
  "food market",
  "live gig",
  "board game cafe",
  "open mic night",
  "charity fundraiser night",
  "football match",
  "rugby match",
  "comedy club",
  "theme park day trip",
  "paintball",
  "go-karting",
  "street food festival",
  "beach day",
  "bingo night",
  "art exhibition",
  "museum visit",
  "salsa dancing class",
  "roller disco",
  "mini golf",
  "afternoon tea",
  "hiking trip",
  "cultural food tour",
  "trampoline park",
  "shopping spree",
  "afternoon pub crawl",
  "silent disco",
  "gaming arcade",
  "charity fun run",
  "pottery class",
  "ghost tour",
  "whisky tasting",
  "sports club social",
  "pool or snooker night",
  "spa day",
  "night-time stargazing",
  "open air cinema",
  "visiting a botanical garden",
];
