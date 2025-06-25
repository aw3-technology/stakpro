import { AppLayout } from '@/layouts/app-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { SettingsLayout } from '@/layouts/settings-layout';
import { Login } from '@/pages/auth-layout/login';
import { SignUp } from '@/pages/auth-layout/sign-up';
import { PasswordReset } from '@/pages/auth-layout/password-reset';
import { Route, Routes as ReactRoutes, Outlet } from 'react-router';
import { Home } from '@/pages/app-layout/home';
import { ChatProvider } from '@/providers/chat-provider';
import { Explore } from '@/pages/app-layout/explore';
import { MyTrips } from '@/pages/app-layout/my-trips';
import { Saved } from '@/pages/app-layout/saved';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Profile } from '@/pages/settings-layout/profile';
import { Preferences } from '@/pages/settings-layout/preferences';
import { Notifications } from '@/pages/settings-layout/notifications';
import { History } from '@/pages/settings-layout/history';
import { Plans } from '@/pages/settings-layout/plans';
import { Billing } from '@/pages/settings-layout/billing';
import { Usage } from '@/pages/settings-layout/usage';
import { AffiliateProgram } from '@/pages/settings-layout/affiliate-program';
import { Payouts } from '@/pages/settings-layout/payouts';
import { Updates } from '@/pages/settings-layout/updates';
import { Terms } from '@/pages/settings-layout/terms';
import { PrivacyPolicy } from '@/pages/settings-layout/privacy-policy';
import { NotFound } from '@/pages/app-layout/not-found';
import { Banner } from '@/components/custom/banner';

export const Routes = () => {
  return (
    <ReactRoutes>
      <Route
        element={
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/password-reset" element={<PasswordReset />} />
      </Route>
      <Route
        element={
          <AppLayout>
            <Banner />
            <ChatProvider>
              <Outlet />
            </ChatProvider>
          </AppLayout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        element={
          <SidebarProvider>
            <SettingsLayout>
              <Outlet />
            </SettingsLayout>
          </SidebarProvider>
        }
      >
        <Route path="/profile" element={<Profile />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/history" element={<History />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/usage" element={<Usage />} />
        <Route path="/affiliate-program" element={<AffiliateProgram />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Route>
    </ReactRoutes>
  );
};
