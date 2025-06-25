import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { changePasswordSchema } from './change-password-form-schema';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePasswordModal } from '../../../hooks/use-change-password-modal-store';

export const ChangePasswordForm = () => {
  const { setOpen } = useChangePasswordModal();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      verifyNewPassword: '',
    },
  });

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState<boolean>(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState<boolean>(false);
  const [isVerifyNewPasswordVisible, setIsVerifyNewPasswordVisible] =
    useState<boolean>(false);

  const toggleCurrentPasswordVisibility = () =>
    setIsCurrentPasswordVisible((prevState) => !prevState);
  const toggleNewPasswordVisibility = () =>
    setIsNewPasswordVisible((prevState) => !prevState);
  const toggleVerifyNewPasswordVisibility = () =>
    setIsVerifyNewPasswordVisible((prevState) => !prevState);

  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    setLoading(true);
    console.log('Submitted:', values);
    setTimeout(() => {
      setLoading(false);
      form.reset();
      setOpen(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, []);

  return (
    <Form {...form}>
      <form
        className="space-y-4 pt-6 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col py-6 gap-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm text-foreground">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={isCurrentPasswordVisible ? 'text' : 'password'}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={toggleCurrentPasswordVisibility}
                    >
                      {isCurrentPasswordVisible ? (
                        <EyeIcon className="size-3" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="size-3" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm text-foreground">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={isNewPasswordVisible ? 'text' : 'password'}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={toggleNewPasswordVisibility}
                    >
                      {isNewPasswordVisible ? (
                        <EyeIcon className="size-3" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="size-3" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verifyNewPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm text-foreground">
                  Verify New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={isVerifyNewPasswordVisible ? 'text' : 'password'}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      size="icon"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={toggleVerifyNewPasswordVisibility}
                    >
                      {isVerifyNewPasswordVisible ? (
                        <EyeIcon className="size-3" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="size-3" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full text-sm text-primary-foreground"
          disabled={loading}
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Update Password
        </Button>
      </form>
    </Form>
  );
};
