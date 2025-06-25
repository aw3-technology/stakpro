import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AppleLogoSVG from '/images/apple-logo.svg?inline';
import GoogleLogoSVG from '/images/google-logo.svg?inline';
import { useNavigate, Link } from 'react-router';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'email@example.ai',
      password: '?2j!@#$%^&*()',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (values.email !== '' && values.password !== '') {
      navigate('/');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="enter your email address eg. test@test.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="enter your password eg. Password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" className="cursor-pointer" />
            <Label
              htmlFor="remember"
              className="text-sm font-normal text-muted-foreground cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          <Link
            to="/password-reset"
            className="text-sm font-normal text-muted-foreground"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="flex items-center justify-center text-xs">
        <span className="w-full border-t border-foreground/10"></span>
        <span className="px-2 text-muted-foreground shrink-0">
          or sign with
        </span>
        <span className="w-full border-t border-foreground/10"></span>
      </div>


      <div className="flex gap-4">
        <Button variant="secondary" className="flex-1">
          <img src={GoogleLogoSVG} alt="Google" className="w-4 h-4" />
          Google
        </Button>
        <Button variant="secondary" className="flex-1">
          <img src={AppleLogoSVG} alt="Apple" className="w-4 h-4 invert dark:brightness-0" />
          Apple
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/sign-up" className="text-foreground">
          Sign Up
        </Link>
      </p>
    </Form>
  );
};
