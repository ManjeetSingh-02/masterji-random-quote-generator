// get all elements by id's
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const generate = document.getElementById("generate");
const copy = document.getElementById("copy");
const save = document.getElementById("save");
const tweet = document.getElementById("tweet");
const customMessage = document.getElementById("customMessage");

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

// click event listener to copy generated quote and give custom message to user
copy.addEventListener("click", () => {
  // copy to clipboard
  navigator.clipboard.writeText(quoteText.textContent);

  // create custom message and show to user
  customMessage.textContent = "Copied to Clipboard";
  customMessage.style.translate = "0";

  // after 1s, remove the custom message
  setTimeout(() => (customMessage.style.translate = " 0 -200%"), 1000);
});

// click event listener to export image
save.addEventListener("click", exportImagewithQuote);

// click event listener to redirect to x.com for tweet
tweet.addEventListener("click", () => window.open(`https://twitter.com/intent/tweet?text=${quoteText.textContent} ${quoteAuthor.textContent}`));

// function to convert the big quote text into array of small sentences
function getWrappedText(text, maxWidth, context) {
  // get each word from the text and store to array
  const words = text.split(" ");
  const sentences = [];
  let sentence = "";

  // loop words array and form the sentence
  words.forEach((word) => {
    // form a test sentence
    let testSentence = sentence + word + " ";
    let metrics = context.measureText(testSentence);

    // add sentence to sentences array
    if (metrics.width > maxWidth && sentence.length > 0) {
      sentences.push(sentence.trim());
      sentence = word + " ";
    } else sentence = testSentence;
  });

  // add the final sentence(if any) to array
  sentences.push(sentence.trim());

  // return the array of sentences
  return sentences;
}

// function to save the image with quote
function exportImagewithQuote() {
  // create a canvas element
  const canvasElement = document.createElement("canvas");

  // set its context/dimension to 2d
  const canvasContext = canvasElement.getContext("2d");

  // create image element
  const image = document.createElement("img");

  // get the background image from homepage
  let quoteImg = document.getElementsByClassName("quote-box");
  quoteImg = quoteImg[0].getElementsByTagName("img");

  // set image src, width and height same as the image on homepage
  image.src = quoteImg[0].src;
  image.height = quoteImg[0].height;
  image.width = quoteImg[0].width;

  // prevent cors error
  image.crossOrigin = "anonymous";

  image.onload = function () {
    // set height and width of canvas element equal to image element
    canvasElement.height = image.height;
    canvasElement.width = image.width;

    // draw image into canvas
    canvasContext.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);

    // set opacity of box to 50%
    canvasContext.fillStyle = "rgba(0, 0, 0, 0.5)";

    // draw box into canvas
    canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // set text color as white and to be centered in canvas element
    canvasContext.font = "bold 20px Arial";
    canvasContext.fillStyle = "white";
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "middle";

    // get big quote into sentences
    const quoteSentences = getWrappedText(quoteText.textContent, canvasElement.width * 0.8, canvasContext);

    // set height for quote sentence
    let quoteSentenceHeight = 0;

    // loop through quote sentences
    quoteSentences.forEach((sentence) => {
      // draw each quote sentence into canvas
      canvasContext.fillText(sentence, canvasElement.width / 2, canvasElement.height / 3 + quoteSentenceHeight);

      // increase height for quote sentence
      if (quoteSentences.length <= 3) quoteSentenceHeight += quoteSentences.length * (45 / quoteSentences.length);
      else quoteSentenceHeight += quoteSentences.length * 10;
    });

    // change color of author name
    canvasContext.fillStyle = "rgb(180, 180, 180)";

    // draw author name into canvas
    canvasContext.fillText(quoteAuthor.textContent, canvasElement.width / 2, canvasElement.height / 3 + quoteSentenceHeight);

    const link = document.createElement("a");
    link.href = canvasElement.toDataURL("image/png");
    link.download = "quote.png";
    link.click();
    link.remove();
  };

  // create custom message and show to user
  customMessage.textContent = "Downloading Image with Quote";
  customMessage.style.translate = "0";

  // after 1s, remove the custom message
  setTimeout(() => (customMessage.style.translate = " 0 -200%"), 1000);
}

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
