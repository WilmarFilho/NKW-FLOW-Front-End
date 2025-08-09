import { User } from './user';

export interface Attendant {
  id: string;
  user_id: string;
  user_admin_id: string;
  user: User;
  user_admin: User;
}
