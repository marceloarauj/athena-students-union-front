export type LoginResponse = {
  token: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
};
