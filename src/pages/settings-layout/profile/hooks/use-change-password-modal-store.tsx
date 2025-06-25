import { proxy, useSnapshot } from 'valtio';

interface ChangePasswordModalState {
  open: boolean;
}

const state = proxy<ChangePasswordModalState>({
  open: false,
});

export const useChangePasswordModal = () => {
  const snapshot = useSnapshot(state);

  return {
    open: snapshot.open,
    setOpen: (open: boolean) => {
      state.open = open;
    },
  };
};
