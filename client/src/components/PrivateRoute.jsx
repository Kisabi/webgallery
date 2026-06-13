import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Компонент захисту маршрутів від неавторизованого доступу.
 * Якщо токен відсутній — перенаправляє на сторінку входу.
 * @param {{ children: React.ReactNode }} props
 */
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
