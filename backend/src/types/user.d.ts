

interface NewUser {
    name: string,
    email: string,
    password: string,
    isAdmin?: boolean
}

interface User extends NewUser {
    id: string,
    isAdmin: boolean,
    created_at: string
}
type UserListQuery = {
    limit?: number;
    offset?: number;
    q?: string;
    sort_by?: "name"
  };