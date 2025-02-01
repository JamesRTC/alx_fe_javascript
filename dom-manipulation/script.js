document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.querySelector("#quoteDisplay");
  const newQuote = document.querySelector("#newQuote");
  const categorySelect = document.getElementById("categoryFilter");
  const importFileInput = document.querySelector("#importFile");
  const exportQuotesBtn = document.querySelector("#exportQuotes");

  // Initialize the quotes array
  let quotes = [
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

  // Load quotes from localStorage if available
  function loadQuotes() {
    const savedQuotes = JSON.parse(localStorage.getItem("quotes"));
    if (savedQuotes) {
      quotes = savedQuotes;
    }
  }

  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Save last viewed quote to sessionStorage
  function saveLastViewedQuote(quoteText) {
    sessionStorage.setItem("lastViewedQuote", quoteText);
  }

  // Show a random quote
  function showRandomQuote() {
    let randomNum = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomNum];
    quoteDisplay.textContent = randomQuote.text;
    saveLastViewedQuote(randomQuote.text); // Save last viewed quote in sessionStorage
  }

  function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addNewQuote">Add Quote</button>
    `;
    document.body.appendChild(formContainer);

    // Add event listener for adding new quotes
    const addNewQuoteButton = formContainer.querySelector("#addNewQuote");
    addNewQuoteButton.addEventListener("click", addQuote);
  }

  // Add new quote to the quotes array and update local storage
  function addQuote() {
    const newQuoteText = document.querySelector("#newQuoteText").value.trim();
    const newQuoteCategory = document.querySelector("#newQuoteCategory").value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
      alert("Please fill in both fields.");
      return;
    }

    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    showRandomQuote(); // Immediately show the new quote
    populateCategories(); // Update the dropdown if a new category is added
    document.querySelector("#newQuoteText").value = "";
    document.querySelector("#newQuoteCategory").value = "";
  }

  // Populate the category dropdown dynamically
  function populateCategories() {
    const categories = [...new Set(quotes.map((q) => q.category))];
    categorySelect.innerHTML = "<option value='all'>All Categories</option>";
    categories.forEach((category) => {
      let option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    // Retrieve last selected category from localStorage
    const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
    if (lastSelectedCategory) {
      categorySelect.value = lastSelectedCategory;
    }
  }

  // Filter quotes by selected category
  function filterQuotes() {
    const selectedCategory = categorySelect.value;
    localStorage.setItem("lastSelectedCategory", selectedCategory);

    if (selectedCategory === "all") {
      showRandomQuote();
    } else {
      const filteredQuotes = quotes.filter((q) => q.category === selectedCategory);
      if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.textContent = randomQuote.text;
        saveLastViewedQuote(randomQuote.text);
      } else {
        quoteDisplay.textContent = "No quotes available in this category.";
      }
    }
  }

  // Export quotes to JSON file
  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Initialize the app on page load
  loadQuotes(); // Load saved quotes from localStorage
  populateCategories(); // Populate the category dropdown

  // Check if there's a last viewed quote in sessionStorage
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
    quoteDisplay.textContent = lastViewedQuote;
  } else {
    showRandomQuote();
  }

  createAddQuoteForm(); // Add the form to the page

  // Event Listeners
  newQuote.addEventListener("click", showRandomQuote);
  categorySelect.addEventListener("change", filterQuotes);
  exportQuotesBtn.addEventListener("click", exportQuotes);
  importFileInput.addEventListener("change", importFromJsonFile);
});
