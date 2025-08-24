import { config } from "../config";
import type { User } from "../types/api";

export async function checkAuth() {
  try {
    const res = await fetch(`${config.BACKEND_API_URL}/users`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const user = (await res.json()) as User;
      return user;
    }

    if (res.status === 401) {
      const refreshRes = await fetch(
        `${config.BACKEND_API_URL}/users/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!refreshRes.ok) {
        return null;
      }

      const newRes = await fetch(`${config.BACKEND_API_URL}/users`, {
        method: "GET",
        credentials: "include",
      });

      if (!newRes.ok) {
        return null;
      }

      const user = (await newRes.json()) as User;
      if (!user) {
        return null;
      }
      return user;
    }

    return null;
  } catch (err: unknown) {
    return null;
  }
}
