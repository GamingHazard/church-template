import { useState, useEffect, createContext, useContext } from 'react';
import { Configs } from '../lib/utils';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
interface User {
  id: string;
  username: string;
  role: string;
}
interface Visitor {
  _id: string;
  visitorId: string;
  uuid: string;
  profileImage: { url: string; public_id: string };
  reminders: any[];
  banned: { status: boolean; reason: string };
  isVerified: boolean;
  email: string;
}

interface AuthContextType {
  user: User | null;
  visitor: Visitor | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider(): AuthContextType {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  
  // Check for stored authentication on load
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
     const storedVisitorId = localStorage.getItem('visitor_id');
     const storedVisitorProfile = localStorage.getItem('visitor_profile');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }

    if (storedVisitorId) {
      setVisitorId(storedVisitorId)
      
       
    }else {
        createVisitorProfile();
      }


    setIsLoading(false);
     
  }, []);

  const createVisitorProfile = async ()  => {
   
    
      try { 
        const newVisitorId = uuidv4();

         
        
        const response = await axios.post(`${Configs.url}/api/news-letter/new/visitor`, {
          uuid: newVisitorId,
        });
        if (response.status === 201) {
          const data = response.data.visitor as Visitor;
          localStorage.setItem('visitor_id', newVisitorId);
          localStorage.setItem('visitor_profile', JSON.stringify(data));
          setVisitorId(newVisitorId);
      setVisitor(data);
        }

      } catch (error) {
        console.error('Error creating visitor profile:', error);
        return null;
      }
    }  
   
  

  const login = async (username: string, password: string): Promise<boolean> => {
    
    if (username === 'admin' && password === 'faithlife2024') {
      const adminUser: User = {
        id: '1',
        username: 'admin',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('auth_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return {
    user,
    visitor,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    isLoading
  };
}

export { AuthContext };