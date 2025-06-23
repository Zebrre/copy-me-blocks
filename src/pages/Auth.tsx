
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, fullName);
      }

      if (result.error) {
        toast({
          title: t('auth.error'),
          description: result.error.message,
          variant: 'destructive',
        });
      } else if (!isLogin) {
        toast({
          title: t('auth.signupSuccess'),
          description: t('auth.checkEmail'),
        });
      }
    } catch (error) {
      toast({
        title: t('auth.error'),
        description: t('auth.unexpectedError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {isLogin ? t('auth.signIn') : t('auth.signUp')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('auth.fullNamePlaceholder')}
                  className="mt-1"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
            >
              {loading ? t('auth.loading') : isLogin ? t('auth.signIn') : t('auth.signUp')}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-[#2563EB] hover:text-[#1d4ed8]"
            >
              {isLogin ? t('auth.needAccount') : t('auth.haveAccount')}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
