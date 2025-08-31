import i18next from 'i18next';

export const initI18n = () => {
  return i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: {
          feed: 'Фиды',
          posts: 'Посты',
          addFeed: 'Добавить',
          placeholderUrl: 'Ссылка RSS',
          exampleUrl: 'Пример: https://lorem-rss.hexlet.app/feed',
          successAdd: 'RSS успешно загружен',
          invalidRss: 'Ресурс не содержит валидный RSS',
          validation: {
            required: 'Не должно быть пустым',
            invalidUrl: 'Ссылка должна быть валидным URL',
            duplicate: 'RSS уже существует',
          },
        },
      },
    },
  });
};