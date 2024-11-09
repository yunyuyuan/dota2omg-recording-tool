import { useSnackbar, type VariantType } from "notistack";

export const useNotifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notify = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, { variant, autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center'} });
  };

  return { notify };
}
