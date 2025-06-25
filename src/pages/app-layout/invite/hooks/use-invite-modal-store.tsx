import { proxy, useSnapshot } from 'valtio';

interface InviteModalState {
  open: boolean;
}

const state = proxy<InviteModalState>({
  open: false,
});

export const useInviteModal = () => {
  const snapshot = useSnapshot(state);

  return {
    open: snapshot.open,
    setOpen: (open: boolean) => {
      state.open = open;
    },
  };
};
