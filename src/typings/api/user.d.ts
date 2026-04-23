declare namespace Api {
  namespace User {
    type UserRole = 'R_SUPER' | 'R_ADMIN' | 'R_USER_COMMON';

    interface UserRecord {
      id: string;
      userName: string;
      displayName: string;
      role: UserRole;
      isActive: boolean;
      createdAt: string;
    }

    interface UserListQuery {
      keyword?: string;
      role?: UserRole;
    }

    interface CreateUserPayload {
      userName: string;
      displayName: string;
      role: UserRole;
      isActive: boolean;
      password: string;
    }

    interface UpdateUserPayload {
      userName: string;
      displayName: string;
      role: UserRole;
      isActive: boolean;
      password?: string;
    }
  }
}
