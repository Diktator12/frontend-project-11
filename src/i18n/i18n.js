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
          validation: {
            required: 'Ссылка обязательна для ввода.',
            invalidUrl: 'Введите правильный URL.',
            duplicate: 'Этот URL уже существует в списке.',
          },
        },
      },
    },
  });
};