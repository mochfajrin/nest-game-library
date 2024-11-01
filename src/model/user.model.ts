export class RegisterUserRequest {
  username: string;
  password: string;
  name: string;
}

export class UserPayload {
  id: string;
  username: string;
  name: string;
}

export class UserResponse {
  username: string;
  name: string;
  access_token?: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}
