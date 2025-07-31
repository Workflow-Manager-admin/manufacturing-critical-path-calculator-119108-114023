import type { LayoutLoad } from './$types';

// PUBLIC_INTERFACE
export const load: LayoutLoad = async () => {
  // No-op. Used for wrapping all routes in global layout and style.
  return {};
};
