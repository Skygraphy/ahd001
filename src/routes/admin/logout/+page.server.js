import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ cookies }) => {
    cookies.delete('admin_session', { path: '/' });
    redirect(303, '/admin/login');
  },
};
