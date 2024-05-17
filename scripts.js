import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books

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

const createBookPreview = ({author, id, image, title}) => {
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
    return element;
}

const starting = document.createDocumentFragment() // a document fragment called "starting"

const initializeDocument = (object, container) => {
    for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
      const bookPreview = createBookPreview({author, id, image, title})

    container.appendChild(bookPreview) // append the created button element to the "starting" document fragment 
};
html.listItems.appendChild(container)
};

const genreOptions = () => {
    const genreHtml = document.createDocumentFragment()
    const firstGenreElement = document.createElement('option') // an option element for "All Genres".
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
};

const authorOptions = () => {
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
}

const setThemeBasedOnPreference = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.settingsTheme.value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    html.settingsTheme.value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
 }  
}

const showMoreButton = () => {
html.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
html.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

html.listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`    
}

const updateTheme = (event) => { // function takes an 'event' object as a parameter which represents an event triggered by submitting a from
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
};

// function filters a list of books based on the provided search criteria, and updates the UI to display the filtered results.
const filteredResults = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = [] // initializes an empty array to store the filtered books.

    for (const book of books) { // loop iterates over each book in the books array.
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true } // variable is set to true if the selected genre is 'any' or if the book's genre matches the selected genre.
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) //statement checks if the provided filters (title, author, and genre) match the current book and pushes the book into the result array if they do.
         {
            result.push(book) 
        }
    }

    page = 1;
    matches = result // variables are updated for pagination.

    if (result.length < 1) {
        html.listMessage.classList.add('list__message_show')
    } else {
        html.listMessage.classList.remove('list__message_show') 
    } // if no results are found, a message "No results found. Your filters might be too narrow." will be displayed by adding the list__message_show class to the listMessage element otherwise it won't show.

    html.listItems.innerHTML = ''
    const newItems = document.createDocumentFragment() // document fragment is created to store the filtered book items.


    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) { // loop iterates over the filtered books, creating a button element for each one. button contains the book's image, title, and author, and has a unique data-preview attribute.
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

    html.listItems.appendChild(newItems) // document fragment is appended to the "listItems" element.
    html.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1 // "Show more" button is disabled if there are no more results to display.

    html.listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span> 
    ` //  button's text is updated to show the number of remaining results.

    window.scrollTo({top: 0, behavior: 'smooth'}); // page scrolls to the top
    html.searchOverlay.open = false // search overlay is presumably closed by setting the "open" property of an element "html.searchOverlay" to false.

};
    
// function will load and display additional book items when the "Show more" button is clicked.
const loadMoreBooks = () => {
   const fragment = document.createDocumentFragment() // document fragment is created to hold the new book items to be displayed.

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button') // For each book, a button element is created.
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
        ` // button contains the book's image, title, and author, and has a unique data-preview attribute.

        fragment.appendChild(element)
    }

    html.listItems.appendChild(fragment) // after all the book items are added to the document fragment, it is appended to the html.listItems element, adding the new book items to the UI.
    page += 1 // increments the page variable, which will show the next batch of book items to be loaded when the "Show more" button is clicked again.
};
    
// function updates the displayed book details when a book item in the "listItems" element is clicked.
const bookDetails = (event) => {
  const pathArray = Array.from(event.path || event.composedPath())
    let active = null //  initializes the variable "active" to store the book data.

    for (const node of pathArray) { // loop iterates over the elements in the "pathArray".
        if (active) break

        if (node?.dataset?.preview) { 
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } // // if an element with the data-preview attribute is found, it iterates through the books to find the matching book based on the data-preview value.
        
            active = result
        }
    }
    
    if (active) {
        html.listActive.open = true
        html.listBlur.src = active.image // src attribute is updated with the image from the active book data.
        html.listImage.src = active.image // src attribute is updated with the image from the active book data.
        html.listTitle.innerText = active.title // content is updated with the title from the active book data.
        html.listSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})` // content is updated with the author's name (retrieved from the authors object) and the book's publication year.
        html.listDescription.innerText = active.description // content is updated with the description from the active book data.
    }
};
    
const eventListeners = () => {
    html.settingsForm.addEventListener('submit', updateTheme), // added the updateTheme function as an event listener for the form submission event of the settings form (html.settingsForm), ensuring that the theme will be updated whenever the form is submitted.
    html.searchForm.addEventListener('submit', filteredResults),
    html.listButton.addEventListener('click', loadMoreBooks),
    html.listItems.addEventListener('click', bookDetails),
    html.searchCancel.addEventListener('click', () => {
    html.searchOverlay.open = false}), // event listener hides the search overlay when the user clicks on the search cancel button.
    html.settingsCancel.addEventListener('click', () => {
      html.settingsOverlay.open = false
        }), // event listener hides the settings overlay when the user clicks on the settings cancel button.
    html.headerSearch.addEventListener('click', () => {
      html.searchOverlay.open = true 
      html.searchTitle.focus()
        }), // when the user clicks on the header search element, the search overlay is displayed, and the focus is set to the search title input field.
    html.headerSettings.addEventListener('click', () => {
      html.settingsOverlay.open = true 
        }), // event listener opens the settings overlay when the user clicks on the header settings element.
    html.listClose.addEventListener('click', () => {
      html.listActive.open = false
        }) // when the user clicks on the list close element, this listener hides the active list
};

const runApplication = () => {
  initializeDocument(books, starting);
  genreOptions();
  authorOptions();
  setThemeBasedOnPreference();
  showMoreButton();
  eventListeners();
}

runApplication();
