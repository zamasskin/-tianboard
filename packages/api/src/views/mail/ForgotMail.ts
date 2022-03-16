import { originUrl } from "src/config/env";

export default function (email: string, token: string) {
  return {
    from: '"Fred Foo 👻" <foo@example.com>',
    to: email,
    subject: "Восстановление пароля",
    html: `<b>Восстановление пароля</b>
    <p>Для восстановления пароля перейдите по <a href="${originUrl}/api/account/forgot?email=${email}&uuid=${token}">ссылке</a></p>
    <p>Кеш доступен в течение часа</p>
    `,
  };
}
