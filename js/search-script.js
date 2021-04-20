const fetchURL = 'https://www.micrus.ru/jsearch'
const searchInput = document.querySelector('.search__input')
const searchMenu = document.querySelector('.search-menu')
const searchList = document.querySelector('.search__list')
const searchListItems = searchList.querySelectorAll('.search__list-item')
const searchTabs = document.querySelector('.search__tabs')
let searchResult = true
let searchStringLength

function debounce(fn, debounceTime) {
    let timerId
    
    return function () {
        if (timerId) clearTimeout(timerId)
        return new Promise((resolve) => {
            timerId = setTimeout(() => resolve(fn.apply(this, [...arguments])), debounceTime)
        })
    }
}

function dataOrdering(data) {
    const resultData = [
        {title: 'товарная группа', data: [], type: 1},
        {title: 'популярные запросы', data: [], type: 2},
        {title: 'товары со склада', data: [], type: 3},
        {title: 'товары под заказ', data: [], type: 4},
    ]
    data.forEach(item => {
        if(+item.type === 1 && resultData[0].data.length < 4) {
            resultData[0].data.push(item)
        }
        if(+item.type === 2 && resultData[1].data.length < 4) {
            resultData[1].data.push(item)
        }
        if(+item.type === 3 && resultData[2].data.length < 4) {
            resultData[2].data.push(item)
        }
        if(+item.type === 4 && resultData[3].data.length < 4) {
            resultData[3].data.push(item)
        }
    })
    return resultData
}

function createSearchResult(searchData) { 
    const newSubSearchLists = searchData.map(item => {
        const {data, type} = item
        if(data.length === 0) {
            return { data, type }
        }
        const newSubSearchList = document.createElement('ul')
        newSubSearchList.classList.add('sub-search__list')
        const newSubSearchListItems = data.map(item => {
            const subSearchListItem = document.createElement('li')
            const subSearchListLink = document.createElement('a')
            subSearchListLink.classList.add('sub-search__list-link')
            subSearchListLink.href = `${item.url}`
            subSearchListItem.append(subSearchListLink)
            subSearchListLink.textContent = `${item.description}`
            return subSearchListItem
        })
        newSubSearchList.append(...newSubSearchListItems)
        return { newSubSearchList, type }
    })
    return newSubSearchLists
}

function renderSearchResult(renderElements = []) {
    searchListItems.forEach(item => {
        const oldSubSearchList = item.querySelector('.sub-search__list')
        const newRenderObj = renderElements.find(el => +item.dataset.searchtype === +el.type)
        
        if(newRenderObj.newSubSearchList && oldSubSearchList) {
            oldSubSearchList.replaceWith(newRenderObj.newSubSearchList)
        }
        if(newRenderObj.newSubSearchList && !oldSubSearchList) {
            item.append(newRenderObj.newSubSearchList)
            item.classList.add('search__list-item--active')
        }
        if(newRenderObj?.data?.length === 0 && oldSubSearchList) {
            oldSubSearchList.remove()
            item.classList.remove('search__list-item--active')
        }
    })
}

function clearSearchResults() {
    searchListItems.forEach(item => {
        const subSearchList = item.querySelector('.sub-search__list')
        if(subSearchList) {
            subSearchList.remove()
            item.classList.remove('search__list-item--active')
        }
    })
}

function fetchingData(event) {
    const request = event.target.value
    if((request && searchResult) || !searchResult && (request.length <= searchStringLength)) {
        fetch(`${fetchURL}?keywords=${request}`)
        .then(responce => responce.json())
        .then(result => {
            if(result.length !== 0) {
                searchStringLength = request.length
                searchResult = true
                return createSearchResult(dataOrdering(result))
            }
            clearSearchResults()
            searchResult = false
            searchStringLength = --request.length
        })
        .then(result => {
            if(result) {
                renderSearchResult(result)
            }
        })
    }
    if(!request) {
        clearSearchResults()
    }
}

function focusListener() {
    searchMenu.classList.add('search-menu--active')
    searchInput.removeEventListener('focus', focusListener)
    searchInput.addEventListener('blur', blurListener)
}

function blurListener() {
    const subSearchListLink = document.querySelectorAll(':hover')[document.querySelectorAll(':hover').length - 1]

    if(subSearchListLink.closest('.search')) {
        return
    }
    searchMenu.classList.remove('search-menu--active')
    searchInput.removeEventListener('blur', blurListener)
    searchInput.addEventListener('focus', focusListener)
}


searchInput.addEventListener('input', debounce(fetchingData, 300))
searchInput.addEventListener('focus', focusListener)
searchMenu.addEventListener('mouseleave', () => {
   if(!document.activeElement.matches('.search__input')) {
    searchMenu.classList.remove('search-menu--active')
    searchInput.addEventListener('focus', focusListener)
    searchInput.removeEventListener('blur', blurListener)
   }
})
