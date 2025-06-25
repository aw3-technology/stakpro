import { useChangePasswordModal } from '../../hooks/use-change-password-modal-store';
import { Modal } from '@/components/custom/modal';
import { ChangePasswordForm } from './change-password-form';
import { LockKeyhole } from 'lucide-react';

export const ChangePasswordModal = () => {
  const { open, setOpen } = useChangePasswordModal();

  return (
    <Modal open={open} size='default' setOpen={setOpen}>
      <div className="flex flex-col items-center w-full max-w-[360px] mx-auto">
        <div className="flex pb-4 w-full items-start justify-center">
          <div className="flex bg-card-solid rounded-full w-14 h-14 items-center justify-center">
            <LockKeyhole className="size-3 text-muted-foreground" />
          </div>
        </div>
        <span className="text-lg text-foreground font-medium leading-6">
          Update Your Password
        </span>
        <span className="text-sm text-muted-foreground">
          Secure your account with a new password
        </span>
        <ChangePasswordForm />
      </div>
    </Modal>
  );
};
