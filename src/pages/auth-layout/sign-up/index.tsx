import LogoSmall from '/pixipro-logo-small.svg?inline';
import { SignUpForm } from './sign-up-form';
import { Footer } from '@/components/custom/footer';
export const SignUp = () => {
  return (
    <div className="flex gap-7 p-4 h-screen w-full">
      {/* Content Begin */}
      <div className="flex-2 flex flex-col justify-between h-full overflow-y-auto">
        <div className="flex items-center flex-1 w-full justify-center py-24">
          <div className="flex w-full max-w-[380px] flex-col gap-10">
            <header>
              <img src={LogoSmall} alt="logo" className="object-cover -ml-[20px]" />
              <div className="flex flex-col gap-2">
                <h1>Create an account</h1>
                <span className="text-sm text-muted-foreground">
                  Welcome to Travel Planner. Let’s create your account.
                </span>
              </div>
            </header>

            <SignUpForm />
          </div>
        </div>
        <Footer />
      </div>
      {/* Content End */}
      {/* Background Begin */}
      <div className="w-[460px] h-full hidden lg:flex rounded-lg bg-[url('/images/create-account-bg.jpg')] bg-cover bg-center"></div>
      {/* Background End */}
    </div>
  );
};
