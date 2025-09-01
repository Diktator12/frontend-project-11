import i18next from 'i18next'

export const initI18n = () => i18next.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        feeds: 'Фиды',
        posts: 'Посты',
        success: 'RSS успешно загружен',
        exists: 'RSS уже существует',
        required: 'Не должно быть пустым',
        invalidUrl: 'Ссылка должна быть валидным URL',
        invalidRss: 'Ресурс не содержит валидный RSS',
        network: 'Ошибка сети',
        view: 'Просмотр',
      },
    },
  },
})