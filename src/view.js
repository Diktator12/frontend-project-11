import i18next from 'i18next';

export const renderFeeds = (feeds) => {
  const feedsList = document.querySelector('.feeds .list-group');
  feedsList.innerHTML = '';

  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `
      <h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    `;
    feedsList.appendChild(li);
  });

  document.querySelector('.feeds .card-title').textContent = i18next.t('feeds');
};

export const renderPosts = (posts) => {
  const postsList = document.querySelector('.posts .list-group');
  postsList.innerHTML = '';

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.href = post.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = post.title;
    a.classList.add(post.read ? 'fw-normal' : 'fw-bold');

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18next.t('view');
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';

    button.addEventListener('click', () => {
      post.read = true;
      renderPosts(posts);

      const modal = document.getElementById('modal');
      modal.querySelector('.modal-title').textContent = post.title;
      modal.querySelector('.modal-body').textContent = post.description;
      modal.querySelector('.full-article').href = post.link;
    });

    li.appendChild(a);
    li.appendChild(button);
    postsList.appendChild(li);
  });

  document.querySelector('.posts .card-title').textContent = i18next.t('posts');
};
