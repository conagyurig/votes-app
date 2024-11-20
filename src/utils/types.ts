export interface Room {
  id: string;
  name: string;
}

export interface CreateRoomRequest {
  roomName: string;
}

export interface User {
  id: string;
  roomId: string;
  name: string;
}

export interface CreateUserRequest {
  roomID: string;
  displayName: string;
  optionContent: string;
}

export interface CreateAvailabilityRequest {
  roomID: string;
  dates: string[];
}

export interface Option {
  id: string;
  roomId: string;
  userId: string;
  content: string;
}

export interface Vote {
  id: string;
  optionId: string;
  userId: string;
}

export interface RoomState {
  roomName: string;
  users: User[];
  options: Option[];
  votes: Vote[];
  revealVotes?: boolean;
}

export interface DatesState {
  roomId: string;
  dates: DatesWithUsers[];
}

export interface DatesWithUsers {
  date: string;
  users: string[];
}

export interface TokenPayload {
  user_id: string;
  room_id: string;
}
