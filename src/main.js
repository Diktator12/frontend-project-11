import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import * as yup from 'yup'
import i18next from 'i18next'
import axios from 'axios'
import { renderFeeds, renderPosts } from './view.js'
import { initI18n } from './i18n/i18n.js'

const fetchRSS = url => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url='
  return axios.get(proxyUrl + encodeURIComponent(url))
    .then(res => parseRSS(res.data.contents))
    .catch(err => {
      if (err.isAxiosError) {
        throw new Error('network')
      }
      throw err
    })
}

const parseRSS = xmlString => {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlString, 'application/xml')

  if (xml.querySelector('parsererror')) {
    throw new Error('invalidRss')
  }

  const channel = xml.querySelector('channel')
  const itemEls = Array.from(xml.querySelectorAll('item'))
  if (!channel || itemEls.length === 0) {
    throw new Error('invalidRss')
  }

  const title = channel.querySelector('title')?.textContent ?? ''
  const description = channel.querySelector('description')?.textContent ?? ''

  const items = itemEls.map(item => ({
    id: item.querySelector('guid')?.textContent || item.querySelector('link')?.textContent,
    title: item.querySelector('title')?.textContent ?? '',
    link: item.querySelector('link')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
    read: false,
  }))

  return { title, description, posts: items }
}

document.addEventListener('DOMContentLoaded', () => {
  initI18n().then(() => {
    let feeds = []
    let posts = []

    const form = document.querySelector('.rss-form')
    const input = document.getElementById('url-input')
    const feedback = document.querySelector('.feedback')

    const getSchema = () => yup.object().shape({
      url: yup.string()
        .url('invalidUrl')
        .required('required')
        .test('is-unique', 'exists', value => !feeds.some(f => f.url === value)),
    })

    const addFeed = url => {
      fetchRSS(url)
        .then(({ title, description, posts: newPosts }) => {
          feeds.unshift({ id: Date.now(), title, description, url })
          posts.unshift(...newPosts)

          renderFeeds(feeds)
          renderPosts(posts)

          feedback.textContent = i18next.t('success')
          feedback.classList.remove('text-danger')
          feedback.classList.add('text-success')

          if (feeds.length === 1) checkForUpdates()
        })
        .catch(err => {
          feedback.textContent = i18next.t(err.message)
          feedback.classList.add('text-danger')
        })
    }

    const checkForUpdates = () => {
      const promises = feeds.map(f =>
        fetchRSS(f.url)
          .then(({ posts: newPosts }) => {
            const existingIds = new Set(posts.map(p => p.id))
            const freshPosts = newPosts.filter(p => !existingIds.has(p.id))

            if (freshPosts.length) {
              posts.unshift(...freshPosts)
              renderPosts(posts)
            }
          })
          .catch(() => {}))

      Promise.all(promises).finally(() => setTimeout(checkForUpdates, 5000))
    }

    form.addEventListener('submit', e => {
      e.preventDefault()
      feedback.textContent = ''

      const url = input.value.trim()

      getSchema().validate({ url })
        .then(() => addFeed(url))
        .catch(error => {
          feedback.textContent = i18next.t(error.message)
          input.classList.add('is-invalid')
          feedback.classList.add('text-danger')
        })
      input.value = ''
      input.focus()
    })

    input.addEventListener('input', () => {
      input.classList.remove('is-invalid')
      feedback.textContent = ''
    })
  })
})
