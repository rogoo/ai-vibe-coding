export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserInput = Omit<User, 'id'>;

export interface UserFilter {
  name?: string;
  email?: string;
}
