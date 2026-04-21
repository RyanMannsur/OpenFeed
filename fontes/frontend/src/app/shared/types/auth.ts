export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  loginAt: string;
}

export interface MockApiRequest<TBody = unknown> {
  method: 'GET' | 'POST' | 'PUT';
  url: string;
  params?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
}

export interface MockApiResponse<TData> {
  request: MockApiRequest;
  message: string;
  data: TData;
}