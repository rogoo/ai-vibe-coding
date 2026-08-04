import { User, UserPayload } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8080/api/user';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with status ${response.status}`);
  }

  // 204 No Content (common on DELETE) has no body to parse.
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function getUsers(): Promise<User[]> {
  return fetch(API_URL).then((response) => handleResponse<User[]>(response));
}

export function getUser(id: number): Promise<User> {
  return fetch(`${API_URL}/${id}`).then((response) => handleResponse<User>(response));
}

export function createUser(user: UserPayload): Promise<User> {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).then((response) => handleResponse<User>(response));
}

export function updateUser(id: number, user: UserPayload): Promise<User> {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...user }),
  }).then((response) => handleResponse<User>(response));
}

export function deleteUser(id: number): Promise<void> {
  return fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then((response) =>
    handleResponse<void>(response)
  );
}
