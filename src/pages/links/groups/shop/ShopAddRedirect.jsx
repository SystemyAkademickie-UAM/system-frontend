import { Navigate, useParams } from 'react-router-dom';

/** Przekierowanie legacy `/shop/add` → `/shop`. */
export default function ShopAddRedirect() {
  const { groupId } = useParams();
  return <Navigate to={`/groups/${groupId}/shop`} replace />;
}
