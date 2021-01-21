const quotesURL = `http://localhost:3000/quotes?_embed=likes`
const quotesPostURL = `http://localhost:3000/quotes`
const likesURL = `http://localhost:3000/likes`

// Dom

function renderQuote(quote){
    let quoteUL = document.getElementById("quote-list")
    const LI = document.createElement("li")
    const blockQuote = document.createElement("blockquote")
    const pTag = document.createElement("p")
    const footer = document.createElement("footer")
    const br = document.createElement("br")
    const likeBtn = document.createElement("button")
    const deleteBtn = document.createElement("button")
    const span = document.createElement("span")

    // define classnames on elements
    LI.id = quote.id
    LI.className = 'quote-card'
    blockQuote.className = "blockquote"
    pTag.className = "mb-0"
    footer.className = "blockquote-footer"
    likeBtn.className = 'btn-success'
    deleteBtn.className = 'btn-danger'

    // put the text content into the buttons
    pTag.textContent = quote.quote
    footer.textContent = quote.author
    likeBtn.textContent = "Likes: "
    span.textContent = quote.likes.length
    deleteBtn.textContent = "Delete"

    likeBtn.addEventListener("click", () => addLike(quote.id))
    deleteBtn.addEventListener("click", () => deleteQuote(quote.id))

    likeBtn.append(span)
    blockQuote.append(pTag, footer, br, likeBtn, deleteBtn)
    LI.append(blockQuote)
    quoteUL.append(LI)

}

// Data

function fetchQuotes(){
    fetch(quotesURL)
        .then(resp => resp.json())
        .then(quotes => quotes.forEach(quote => renderQuote(quote)))
}

function newQuote(){
    const newQuoteForm = document.querySelector("#new-quote-form")
    newQuoteForm.addEventListener("submit", handleSubmit)
}

function postQuote(quote){
    fetch(quotesPostURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(quote)
    })
        .then(resp => resp.json())
        .then( quote => renderQuote(quote))
}

function addLike(id){

    fetch(likesURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify( {
            "quoteId": id,
            "createdAt": Date.now()
        })
    })
        .then(resp => {
            if (resp.ok) {
                let li = document.getElementById(id.toString())
                let span = li.querySelector('span')
                span.textContent = (parseInt(span.textContent) + 1)
            }
        })
}

function deleteQuote(quoteId){
    // fetch delete request
    fetch(quotesPostURL + `/${quoteId}`, {
        method: "DELETE"
    })
        .then(resp => resp.json())
        .then(data => {
            // deleting element off the page
            document.getElementById(quoteId).remove()
        })

}


// Handlers
function handleSubmit(e){
    e.preventDefault()
    const quote = {
        quote: e.target.quote.value,
        author: e.target["author"].value,
        likes: []

    }
    postQuote(quote)
    e.target.reset()
}

// Calls

fetchQuotes()
newQuote()