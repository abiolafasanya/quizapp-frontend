import axios from "axios";
export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

class AuthApi {
  private readonly url = "/api/auth";

  async login(payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const { data } = await axios.post<{ data: AuthResponse }>(
      `${this.url}/login`,
      payload
    );
    return data.data;
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const { data } = await axios.post<{ data: AuthResponse }>(
      `${this.url}/register`,
      payload
    );
    return data.data;
  }
}

export const authApi = new AuthApi();
