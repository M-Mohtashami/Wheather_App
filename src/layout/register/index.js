import { Button, Textfield } from '@/components';
import { DB } from '@/library';
import { El } from '@/library/elem';
import { routes } from '@/Routes';

export const register = () => {
  return El({
    element: 'form',
    id: 'register-form',
    eventListener: [
      {
        event: 'submit',
        callback: registerHandler,
      },
    ],
    className:
      'bg-slate-100 p-4 py-8 rounded-md border border-slate-200 shadow-md dark:bg-slate-600 dark:border-slate-500 dark:shadow-slate-400 dark:shadow-sm',
    children: [
      Textfield({
        label: 'Your Name',
        type: 'text',
        name: 'username',
        placeholder: 'your name',
        required: true,
      }),
      Textfield({
        label: 'Your email',
        type: 'email',
        name: 'email',
        placeholder: 'example@wheather.com',
        required: true,
      }),
      Textfield({
        label: 'Your Password',
        type: 'password',
        name: 'password',
        required: true,
      }),
      Textfield({
        label: 'Confirm Password',
        type: 'password',
        name: 'confirmPassword',
        required: true,
      }),
      Button({
        child: 'Register',
        type: 'submit',
      }),
      El({
        element: 'span',
        className: 'text-slate-800 pl-4 dark:text-slate-200',
        innerText: 'or',
      }),
      Button({
        child: 'Login',
        id: 'to-login',
        eventListener: [
          {
            event: 'click',
            callback: toLogin,
          },
        ],
        variant: 'link',
        classes:
          'text-slate-800 font-semibold px-4 underline dark:text-slate-200',
      }),
    ],
  });
};

export const registerHandler = (e) => {
  e.preventDefault();
  const users = new DB('users');
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  users.addItem(data).then(() => {
    history.pushState(null, null, '/login');
    routes();
  });
};
export const toLogin = () => {
  history.pushState(null, null, '/login');
  routes();
};