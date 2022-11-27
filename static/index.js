const posts = document.querySelector('#posts')
const url = 'http://localhost:3000/quote'

fetch(url, {method:'GET', headers:{"Content-type": "application/json"}})
.then((response) => response.json())
.then((posts) => {
    let html = ''
    posts.map((post) => {
        html += `
        <div>
            <p>${post.quoteText}</br>
            ${post.quoteAuthor}</p>
        </div>
        `
    })
    posts.innerHTML = html
})