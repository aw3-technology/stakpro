import LogoSmall from '/pixipro-logo-small.svg?inline';
import { LoginForm } from './login-form';
import { Footer } from '@/components/custom/footer';
export const Login = () => {
  return (
    <div className="flex gap-7 p-4 h-screen w-full">
      {/* Content Begin */}
      <div className="flex-2 flex flex-col justify-between h-full overflow-y-auto">
        {/* Login Form Begin */}
        <div className="flex items-center flex-1 w-full justify-center py-24">
          <div className="flex w-full max-w-[380px] flex-col gap-10">
            <header>
              <img src={LogoSmall} alt="logo" className="object-cover -ml-[20px]" />
              <div className="flex flex-col gap-2">
                <h1>Sign in</h1>
                <span className="text-sm text-muted-foreground">
                  Welcome back to Travel Planner. Please enter your details below
                  to sign in.
                </span>
              </div>
            </header>

            <LoginForm />
          </div>
        </div>
        <Footer />
        {/* Login Form End */}
      </div>
      {/* Content End */}
      {/* Background Begin */}
      <div className="w-[460px] 2xl:w-[600px] h-full hidden lg:flex rounded-lg bg-[url('/images/login-bg.jpg')] bg-cover bg-center"></div>
      {/* Background End */}
    </div>
  );
};
