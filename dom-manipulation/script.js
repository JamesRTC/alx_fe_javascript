document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.querySelector("#quoteDisplay");
  const newQuote = document.querySelector("#newQuote");
  const categorySelect = document.querySelector("#quoteCategoryFilter");
  const filterQuoteBtn = document.querySelector("#filterQuote");

  const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    {
      text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      category: "Perseverance",
    },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
    { text: "Do what you can, with what you have, where you are.", category: "Action" },
    { text: "Opportunities multiply as they are seized.", category: "Success" },
    { text: "A journey of a thousand miles begins with a single step.", category: "Wisdom" },
    { text: "The best way to predict the future is to create it.", category: "Ambition" },
    { text: "Simplicity is the ultimate sophistication.", category: "Minimalism" },
    { text: "The mind is everything. What you think you become.", category: "Mindset" },
  ];

  newQuote.addEventListener("click", () => {
    let randomNum = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomNum].text;
  });

  // Extract unique categories from the quotes array
  let categories = [...new Set(quotes.map((q) => q.category))];

  // Populate the dropdown with existing categories on page load
  categories.forEach((category) => {
    let option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  // Function to show a random quote
  // function showRandomQuote() {
  //   let randomNum = Math.floor(Math.random() * quotes.length);
  //   quoteDisplay.textContent = quotes[randomNum].text;
  // }

  // Function to add a new quote
  function addQuote() {
    let text = newQuoteText.value.trim();
    let category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
      alert("All input fields are required");
      return;
    }

    let quote = { text, category };
    quotes.push(quote);

    // Add new category to dropdown if it's unique
    if (!categories.includes(category)) {
      categories.push(category);
      let option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }

    newQuoteText.value = "";
    newQuoteCategory.value = "";
  }

  // Add event listener to the Add Quote button
  const addQuoteBtn = document.querySelector("#addQuote");
  //   addQuoteBtn.addEventListener("click", addQuote);

  // Filter quotes based on category
  filterQuoteBtn.addEventListener("click", () => {
    let selectedCategory = categorySelect.value;

    if (selectedCategory === "all") {
      showRandomQuote();
    } else {
      let filteredQuotes = quotes.filter((quote) => quote.category === selectedCategory);
      if (filteredQuotes.length > 0) {
        let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = filteredQuotes[randomIndex].text;
      } else {
        quoteDisplay.textContent = "No quotes available for this category.";
      }
    }
  });

  // Create Add Quote Form dynamically
  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuote" onclick="addQuote()">Add Quote</button>
      `;
    document.body.appendChild(formContainer);
  }

  // Call the function to create the Add Quote Form when the page loads
  createAddQuoteForm();
  window.addQuote = addQuote;
});
