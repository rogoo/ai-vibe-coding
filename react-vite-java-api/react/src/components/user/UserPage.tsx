import { UserProvider } from '../../provider/UserProvider';
import User from './User';

/** Route component for `/user`: supplies the UserProvider to the screen. */
export function UserPage() {
  return (
    <UserProvider>
      <User />
    </UserProvider>
  );
}

export default UserPage;
