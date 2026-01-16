import { Navigate } from 'react-router-dom';

// Redirect to auth sign-in page
const Index = () => {
  return <Navigate to="/auth/sign-in" replace />;
};

export default Index;
