
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hackathon-light">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-hackathon-dark mb-2">LAKSHAGRIHA HACKATHON 4.0</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Dev Bhoomi Uttarakhand University (DBUU) presents its biggest International Hackathon 
            organized by the Department of Computer Science & Engineering (SoEC)!
          </p>
        </div>

        <Card className="border-2 border-hackathon-red/20 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              <span className="text-hackathon-red">Evaluation</span> Portal
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-hackathon-blue/30 focus:border-hackathon-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-hackathon-blue/30 focus:border-hackathon-blue"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-hackathon-red hover:bg-hackathon-red/80" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-gray-500 text-center">
              <p>For demo purposes:</p>
              <p>Admin: admin@example.com / admin123</p>
              <p>Judge: judge1@example.com / judge123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
