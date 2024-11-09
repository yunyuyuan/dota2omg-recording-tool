import { useSnackbar, type VariantType } from "notistack";

export const useNotifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notify = (message: string, variant: VariantType) => {
    enqueueSnackbar(message, { variant, autoHideDuration: 2000, anchorOrigin: { vertical: 'top', horizontal: 'center'} });
  };

  return { notify };
}

export const getImgUrl = (isCDN: boolean | undefined, type: 'heroes' | 'abilities', name: string) => {
  if (isCDN) {
    return `https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/${type}/${name}.png`
  }
  return `/data-images/${name}.png`
}
