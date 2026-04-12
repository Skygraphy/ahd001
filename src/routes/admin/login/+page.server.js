import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function load({ cookies }) {
  if (cookies.get('admin_session') === env.ADMIN_PASSWORD) {
    redirect(303, '/admin');
  }
}

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const password = data.get('password')?.toString() ?? '';

    if (!password || password !== env.ADMIN_PASSWORD) {
      return fail(401, { error: 'Falsches Passwort.' });
    }

    cookies.set('admin_session', env.ADMIN_PASSWORD, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
    });

    redirect(303, '/admin');
  },
};
