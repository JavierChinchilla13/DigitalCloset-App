# Frontend Integration Guide - User Management & RBAC

This document outlines the necessary changes in the React frontend to support the new backend features: User Profile Management and Role-Based Access Control (RBAC).

## 1. Type Definitions (`src/types/index.ts`)

Update the `User` and `AuthResponse` types to include the `role` and `active` status.

```typescript
export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface User {
  userId: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: Role; // Ensure backend returns this in AuthResponse if possible, otherwise extract from JWT
}
```

## 2. API Service Extensions (`src/api/userService.ts`)

Create a new service to handle user-related requests.

```typescript
import api from './axios';
import { User } from '../types';

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateProfile: async (data: { firstName?: string; lastName?: string }): Promise<User> => {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  },

  deactivateAccount: async (): Promise<void> => {
    await api.patch('/users/me/deactivate');
  },

  // Admin only
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  toggleUserStatus: async (userId: number, activate: boolean): Promise<User> => {
    const endpoint = `/users/${userId}/${activate ? 'reactivate' : 'deactivate'}`;
    const response = await api.patch<User>(endpoint);
    return response.data;
  }
};
```

## 3. Auth Context Update (`src/context/AuthContext.tsx`)

Update the `AuthContext` to store the user's role and handle permissions.

```typescript
interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// In AuthProvider:
const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

const login = (newToken: string, userData: User) => {
  localStorage.setItem('token', newToken);
  localStorage.setItem('user', JSON.stringify(userData));
  setToken(newToken);
  setUser(userData);
};

const isAdmin = user?.role === Role.ROLE_ADMIN;
```

## 4. Protected Routes (`src/components/ProtectedRoute.tsx`)

Implement role-based routing to protect admin pages.

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  requiredRole?: Role;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />; // Or a "Unauthorized" page
  }

  return <Outlet />;
};
```

## 5. UI Components Needed

### Profile Page (`src/pages/ProfilePage.tsx`)
- Display user details (Email, Role, Join Date).
- Form to update `firstName` and `lastName`.
- "Deactivate Account" button with a confirmation modal.

### Admin Dashboard (`src/pages/AdminPage.tsx`)
- Table listing all users.
- Badge for "Active/Inactive" status.
- Actions to deactivate or reactivate users.

### Navigation Update
- Show an "Admin Panel" link in the navbar ONLY if `user.role === 'ROLE_ADMIN'`.
