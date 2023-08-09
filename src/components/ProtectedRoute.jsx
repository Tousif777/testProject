import { Navigate } from 'react-router-dom'
import { useUserContext } from '../context/userContext'
const ProtectedRoute = ({ children }) => {

    const { user } = useUserContext();
    if (!user) {
        return <Navigate to='/'/>
    }
    else {
        return children;
    }
}

export default ProtectedRoute;
