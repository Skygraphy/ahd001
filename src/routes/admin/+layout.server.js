export const prerender = false;

import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function load({ cookies, url }) {
  const isLoginPage = url.pathname === '/admin/login';
  const isAuth = cookies.get('admin_session') === env.ADMIN_PASSWORD;

  if (!isAuth && !isLoginPage) {
    redirect(303, '/admin/login');
  }

  return { isAuth };
}
