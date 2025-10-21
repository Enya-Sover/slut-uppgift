

interface NewUser {
    name: string,
    email: string,
}

interface User extends NewUser {
    id: string,
    is_admin: boolean,
    password: string,
    created_at: string
}
type UserListQuery = {
    limit?: number;
    offset?: number;
    q?: string;
    sort_by?: "name"
  };