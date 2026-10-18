const clubs = [
  {
    name: 'Music Club',
    category: 'Arts & Performance',
    description: 'Find your sound, perform together, and celebrate music on campus.',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=80',
    activities: ['Open-mic evenings', 'Band rehearsals', 'Campus performances']
  },
  {
    name: 'Volleyball Club',
    category: 'Sports & Recreation',
    description: 'Train, compete, and enjoy the game with teammates from across campus.',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80',
    activities: ['Weekly training sessions', 'Friendly tournaments', 'Beginner skill clinics']
  },
  {
    name: 'Volunteering Club',
    category: 'Volunteering & Social Impact',
    description: 'Make a positive difference through practical local community projects.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
    activities: ['Community clean-ups', 'Charity drives', 'Mentoring initiatives']
  },
  {
    name: 'Science Club',
    category: 'Academic & Science',
    description: 'Explore big questions through experiments, talks, and hands-on discovery.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
    activities: ['Science talks', 'Lab demonstrations', 'Research challenges']
  },
  {
    name: 'Enactus',
    category: 'Business & Entrepreneurship',
    description: 'Turn ideas into sustainable projects that create real social impact.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
    activities: ['Startup workshops', 'Social enterprise projects', 'Pitch practice']
  },
  {
    name: 'Korean Club',
    category: 'Languages & Culture',
    description: 'Discover Korean language, culture, food, films, and new friendships.',
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=900&q=80',
    activities: ['Conversation circles', 'Film and culture nights', 'Korean food workshops']
  }
];

const dom = typeof document !== 'undefined' ? {
  categoryTabs: document.querySelectorAll('.category-tab'),
  clearSearch: document.getElementById('clearSearch'),
  clubCount: document.getElementById('clubCount'),
  clubGrid: document.getElementById('clubGrid'),
  clubModal: document.getElementById('clubModal'),
  emptyState: document.getElementById('emptyState'),
  joinButton: document.getElementById('joinButton'),
  joinMessage: document.getElementById('joinMessage'),
  mainNavLinks: document.querySelectorAll('.main-nav a'),
  modalActivities: document.getElementById('modalActivities'),
  modalCategory: document.getElementById('modalCategory'),
  modalClose: document.getElementById('modalClose'),
  modalDescription: document.getElementById('modalDescription'),
  modalImage: document.getElementById('modalImage'),
  modalTitle: document.getElementById('modalTitle'),
  placeholderButtons: document.querySelectorAll('[data-placeholder]'),
  searchInput: document.getElementById('clubSearch'),
  toast: document.getElementById('toast')
} : null;

let selectedCategory = 'All Clubs';
let lastFocusedElement;
let toastTimeout;

function filterClubs(items, category, searchTerm) {
  const query = searchTerm.trim().toLowerCase();

  return items.filter((club) => {
    const matchesCategory = category === 'All Clubs' || club.category === category;
    const searchableText = `${club.name} ${club.category} ${club.description}`.toLowerCase();

    return matchesCategory && searchableText.includes(query);
  });
}

function renderClubs() {
  const visibleClubs = filterClubs(clubs, selectedCategory, dom.searchInput.value);

  dom.clubGrid.innerHTML = visibleClubs.map((club) => `
    <article class="club-card">
      <img src="${club.image}" alt="${club.name} members and activities" loading="lazy">
      <div class="club-card-body">
        <h2>${club.name}</h2>
        <p class="club-category">${club.category}</p>
        <p class="club-description">${club.description}</p>
        <button class="details-button" type="button">View Details</button>
      </div>
    </article>
  `).join('');
  dom.emptyState.hidden = visibleClubs.length !== 0;
  dom.clubCount.textContent = `${visibleClubs.length} ${visibleClubs.length === 1 ? 'club' : 'clubs'} shown`;
  dom.clearSearch.hidden = !dom.searchInput.value;
}

function setActiveCategory(categoryTab) {
  selectedCategory = categoryTab.dataset.category;

  dom.categoryTabs.forEach((tab) => {
    const isActive = tab === categoryTab;

    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  renderClubs();
}

function openModal(club) {
  lastFocusedElement = document.activeElement;
  dom.modalImage.src = club.image;
  dom.modalImage.alt = `${club.name} members and activities`;
  dom.modalCategory.textContent = club.category;
  dom.modalTitle.textContent = club.name;
  dom.modalDescription.textContent = club.description;
  dom.modalActivities.innerHTML = club.activities.map((activity) => `<li>${activity}</li>`).join('');
  dom.joinMessage.textContent = '';
  dom.clubModal.classList.add('open');
  dom.clubModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  dom.modalClose.focus();
}

function closeModal() {
  dom.clubModal.classList.remove('open');
  dom.clubModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add('show');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    dom.toast.classList.remove('show');
  }, 2800);
}

function handleCategoryKeydown(event) {
  const navigationKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

  if (!navigationKeys.includes(event.key)) {
    return;
  }

  event.preventDefault();

  const tabs = Array.from(dom.categoryTabs);
  const currentIndex = tabs.indexOf(event.currentTarget);
  let nextIndex = currentIndex;

  if (event.key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = tabs.length - 1;
  }

  tabs[nextIndex].focus();
  setActiveCategory(tabs[nextIndex]);
}

function clearSearch() {
  dom.searchInput.value = '';
  renderClubs();
  dom.searchInput.focus();
}

function handleModalClick(event) {
  if (event.target === dom.clubModal) {
    closeModal();
  }
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape' && dom.clubModal.classList.contains('open')) {
    closeModal();
  }
}

function showJoinPlaceholder() {
  dom.joinMessage.textContent = 'Club registration is coming soon.';
}

function setActiveNavigationLink(activeLink) {
  dom.mainNavLinks.forEach((link) => {
    link.classList.toggle('active', link === activeLink);
  });
}

function initializeEventListeners() {
  dom.categoryTabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveCategory(tab));
    tab.addEventListener('keydown', handleCategoryKeydown);
  });

  dom.searchInput.addEventListener('input', renderClubs);
  dom.clearSearch.addEventListener('click', clearSearch);
  dom.modalClose.addEventListener('click', closeModal);
  dom.clubModal.addEventListener('click', handleModalClick);
  document.addEventListener('keydown', handleDocumentKeydown);
  dom.joinButton.addEventListener('click', showJoinPlaceholder);

  dom.placeholderButtons.forEach((button) => {
    button.addEventListener('click', () => showToast(button.dataset.placeholder));
  });

  dom.mainNavLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveNavigationLink(link));
  });
}

function initializeClubDirectory() {
  initializeEventListeners();
  renderClubs();
}

if (typeof module !== 'undefined') {
  module.exports = { filterClubs };
}

if (dom) {
  initializeClubDirectory();
}
