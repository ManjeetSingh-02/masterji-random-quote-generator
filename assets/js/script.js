// get all elements by id's
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const generate = document.getElementById("generate");
const copy = document.getElementById("copy");
const save = document.getElementById("save");
const tweet = document.getElementById("tweet");

// url and options for fetch request
const apiUrl = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

// click event listener to generate new quote
generate.addEventListener("click", generateRandomQuote);

// click event listener to copy generated quote
copy.addEventListener("click", () => {
  navigator.clipboard.writeText(quoteText.textContent);
  alert("Copied");
});

// click event listener to redirect to x.com for tweet
tweet.addEventListener("click", () => (location.href = `https://twitter.com/intent/tweet?text=${quoteText.textContent} ${quoteAuthor.textContent}`));

// function to generate random quote
function generateRandomQuote() {
  // fetch quote data
  fetch(apiUrl, options)
    .then((res) => res.json())
    .then((data) => {
      // change previous quote to new quote
      quoteText.textContent = data.data.content;

      // change previous author to new author
      quoteAuthor.textContent = "- " + data.data.author;
    })
    .catch((error) => console.log(error));
}

// start application by generating random quote and displaying it
generateRandomQuote();
