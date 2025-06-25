import { Link } from 'react-router';
import { PasswordResetForm } from './password-reset-form';
import LogoSmall from '/pixipro-logo-small.svg?inline';
import { Footer } from '@/components/custom/footer';
import { ArrowLeftIcon } from 'lucide-react';

export const PasswordReset = () => {
  return (
    <div className="flex gap-7 p-4 h-screen w-full">
      {/* Content Begin */}
      <div className="flex-2 flex flex-col justify-between h-full overflow-y-auto">
        <div className="flex items-center flex-1 w-full justify-center py-24">
          <div className="flex w-full max-w-[380px] flex-col gap-10">
            <header>
              <img src={LogoSmall} alt="logo" className="object-cover -ml-[20px]" />
              <div className="flex flex-col gap-2">
                <h1>Password Reset</h1>
                <span className="text-sm text-muted-foreground">
                  Please enter your email and we'll send you a 4-digit code.
                </span>
              </div>
            </header>
            <PasswordResetForm />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
            <Link
              to="/login"
              className="text-center text-sm text-muted-foreground flex items-center gap-1 justify-center"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
      {/* Content End */}
      {/* Background Begin */}
      <div className="w-[460px] h-full hidden lg:flex rounded-lg bg-[url('/images/password-reset-bg.jpg')] bg-cover bg-center"></div>
      {/* Background End */}
    </div>
  );
};
