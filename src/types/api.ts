export type CreateUserRequest = {
  email: string;
  password: string;
};

export type CreateUserResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  hashedPassword: string;
};

// export type LoginResponse = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   email: string;
//   token: string;
// };

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
} | null
// export type RefreshResponse = {
//   token: string;
// };
