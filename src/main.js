import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import { renderFeeds, renderPosts } from './view.js';
import { initI18n } from './i18n/i18n.js';

let feeds = [];
let posts = [];

initI18n().then(() => {
  yup.setLocale({
    mixed: { required: () => i18next.t('validation.required') },
    string: { url: () => i18next.t('validation.invalidUrl') },
  });
});

const getSchema = () => yup.object().shape({
  url: yup.string()
    .url()
    .required()
    .test('is-unique', i18next.t('validation.duplicate'), (value) => !feeds.some((f) => f.url === value)),
});

const fetchRSS = (url) => {
  const proxyUrl = 'https://api.codetabs.com/v1/proxy?quest=';
  return axios.get(proxyUrl + encodeURIComponent(url))
    .then((res) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(res.data, 'application/xml');

      const title = xml.querySelector('channel > title')?.textContent;
      const description = xml.querySelector('channel > description')?.textContent;
      const items = Array.from(xml.querySelectorAll('item')).map((item) => ({
        id: item.querySelector('guid')?.textContent,
        title: item.querySelector('title')?.textContent,
        link: item.querySelector('link')?.textContent,
        description: item.querySelector('description')?.textContent,
        read: false,
      }));

      return { title, description, posts: items };
    })
    .catch((err) => {
      throw new Error('Не удалось загрузить RSS: ' + err.message);
    });
};

const addFeed = (url, feedback) => {
  fetchRSS(url)
    .then(({ title, description, posts: newPosts }) => {
      feeds.unshift({ id: Date.now(), title, description, url });
      posts.unshift(...newPosts);
      renderFeeds(feeds);
      renderPosts(posts);

      feedback.textContent = i18next.t('successAdd');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');

      if (feeds.length === 1) checkForUpdates();
    })
    .catch((err) => {
      feedback.textContent = err.message || 'Не удалось загрузить RSS';
      feedback.classList.add('text-danger');
    });
};

const checkForUpdates = () => {
  const promises = feeds.map((f) =>
    fetchRSS(f.url)
      .then(({ posts: newPosts }) => {
        const existingIds = new Set(posts.map((p) => p.id));
        const freshPosts = newPosts.filter((p) => !existingIds.has(p.id));

        if (freshPosts.length) {
          posts.unshift(...freshPosts);
          renderPosts(posts);
        }
      })
      .catch((err) => {
        console.error(`Ошибка при обновлении ${f.url}:`, err.message);
      })
  );

  Promise.all(promises).finally(() => setTimeout(checkForUpdates, 5000));
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.rss-form');
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('.feedback');

  input.placeholder = i18next.t('placeholderUrl');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.textContent = '';

    const url = input.value.trim();

    getSchema().validate({ url })
      .then(() => addFeed(url, feedback))
      .catch((error) => {
        feedback.textContent = error.errors[0];
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
      });
      input.value = '';
      input.focus();
  });

  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
  });
});