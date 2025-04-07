export interface User {
  id: string;
  email: string;
  name: string;
  authProvider: string;
  createdAt: string;
  profileImage?: string;
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    authProvider: 'linkedin',
    createdAt: '2023-01-15T09:30:00Z',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    settings: {
      theme: 'system',
      notifications: true,
    },
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    authProvider: 'twitter',
    createdAt: '2023-02-20T14:45:00Z',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    settings: {
      theme: 'dark',
      notifications: false,
    },
  },
  {
    id: '3',
    email: 'alex.johnson@example.com',
    name: 'Alex Johnson',
    authProvider: 'linkedin',
    createdAt: '2023-03-10T11:15:00Z',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    settings: {
      theme: 'light',
      notifications: true,
    },
  },
];

// Mock currently logged in user
export const currentUser = mockUsers[0]; 