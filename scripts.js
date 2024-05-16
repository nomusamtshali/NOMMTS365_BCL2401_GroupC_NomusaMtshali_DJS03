import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books

const initializeDocument = () => {
const starting = document.createDocumentFragment() // a document fragment called "starting"

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button') // button is created
    element.classList = 'preview' // add CSS class to button
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    starting.appendChild(element) // append the created button element to the "starting" document fragment 
}
};

initializeDocument();

html.listItems.appendChild(starting)

const collectElements = () => { // function will group and store references to specific elements in a single object for easier access and manipulation instead of calling document.querySelector() everytime
    return {
        searchGenres: document.querySelector('[data-search-genres]'),
        searchAuthors: document.querySelector('[data-search-authors]'),
        settingsTheme: document.querySelector('[data-settings-theme]'), 
        listButton: document.querySelector('[data-list-button]'),
        searchCancel: document.querySelector('[data-search-cancel]'),
        searchOverlay: document.querySelector('[data-search-overlay]'),
        settingsCancel: document.querySelector('[data-settings-cancel]'),
        settingsOverlay: document.querySelector('[data-settings-overlay]'),
        headerSearch: document.querySelector('[data-header-search]'),
        searchTitle: document.querySelector('[data-search-title]'),
        headerSettings: document.querySelector('[data-header-settings]'),
        listClose: document.querySelector('[data-list-close]'),
        listActive: document.querySelector('[data-list-active]'),
        settingsForm: document.querySelector('[data-settings-form]'),
        searchForm: document.querySelector('[data-search-form]'),
        listMessage: document.querySelector('[data-list-message]'),
        listItems: document.querySelector('[data-list-items]'),
        listBlur: document.querySelector('[data-list-blur]'),
        listImage: document.querySelector('[data-list-image]'),
        listTitle: document.querySelector('[data-list-title]'), 
        listSubtitle: document.querySelector('[data-list-subtitle]'),
        listDescription: document.querySelector('[data-list-description]')
    };
};

const html = collectElements(); //html variable stores the object that contains references to the various DOM elements; I'll be able to access these elements through the properties of the html object

const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    genreHtml.appendChild(element)
}

html.searchGenres.appendChild(genreHtml)

const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}

html.searchAuthors.appendChild(authorsHtml)

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.settingsTheme.value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    html.settingsTheme.value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

html.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
html.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

html.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

html.searchCancel.addEventListener('click', () => {
    html.searchOverlay.open = false
})

html.settingsCancel.addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

html.headerSearch.addEventListener('click', () => {
    html.searchOverlay.open = true 
    html.searchTitle.focus()
})

html.headerSettings.addEventListener('click', () => {
   html.settingsOverlay.open = true 
})

html.listClose.addEventListener('click', () => {
    html.listActive.open = false
})

html.settingsForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    html.settingsOverlay.open = false
})

html.searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        html.listMessage.classList.add('list__message_show')
    } else {
        html.listMessage.classList.remove('list__message_show')
    }

    html.listItems.innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    html.listItems.appendChild(newItems)
    html.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    html.listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

html.listButton.addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    html.listItems.appendChild(fragment)
    page += 1
})

html.listItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        html.listActive.open = true
        html.listBlur.src = active.image
        html.listImage.src = active.image
        html.listTitle.innerText = active.title
        html.listSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        html.listDescription.innerText = active.description
    }
})