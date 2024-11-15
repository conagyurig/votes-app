export const API_ROOMS_ENDPOINT = "/api/rooms";
export const API_USER_ENDPOINT = "/api/userOption";
export const API_AVAILABILITY_ENDPOINT = "/api/userAvailability";

// export const API_ROOMS_ENDPOINT = "http://localhost:8080/rooms";
// export const API_USER_ENDPOINT = "http://localhost:8080/userOption";
// export const API_AVAILABILITY_ENDPOINT =
//   "http://localhost:8080/userAvailability";

export function getRoomURL(roomID: String) {
  return (
    "https://whenru3-be-252801953050.europe-west2.run.app/create-user?roomID=" +
    roomID
  );
}
