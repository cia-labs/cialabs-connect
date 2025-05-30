// pages/dashboard/user/[uid].js
import { useRouter } from 'next/router';

export default function UserDashboard() {
  const router = useRouter();
  const { uid } = router.query;

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>User ID: {uid}</p>
    </div>
  );
}
