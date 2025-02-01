document.addEventListener("DOMContentLoaded", () => {
  const quoteDisplay = document.querySelector("#quoteDisplay");
  const newQuote = document.querySelector("#newQuote");
  const addQuoteBtn = document.querySelector("#addQuote");
  const categorySelect = document.querySelector("#quoteCategoryFilter");
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

  // Create the "Add Quote" form dynamically
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
    updateCategoryDropdown(); // Update the dropdown if a new category is added
    document.querySelector("#newQuoteText").value = "";
    document.querySelector("#newQuoteCategory").value = "";
  }

  // Populate the category dropdown dynamically from both default and user-added categories
  function updateCategoryDropdown() {
    // Get all unique categories from the quotes array
    const categories = [...new Set(quotes.map((q) => q.category))];
    categorySelect.innerHTML = "<option value='all'>All Categories</option>"; // Reset dropdown options
    categories.forEach((category) => {
      let option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  // Filter quotes by selected category
  function filterQuotesByCategory() {
    const selectedCategory = categorySelect.value;
    if (selectedCategory === "all") {
      showRandomQuote();
    } else {
      const filteredQuotes = quotes.filter((q) => q.category === selectedCategory);
      if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.textContent = randomQuote.text;
        saveLastViewedQuote(randomQuote.text); // Save last viewed quote in sessionStorage
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
      updateCategoryDropdown(); // Update the dropdown after importing
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Initialize the app on page load
  loadQuotes(); // Load saved quotes from localStorage
  updateCategoryDropdown(); // Update category dropdown
  createAddQuoteForm(); // Dynamically create "Add Quote" form

  // Check if there's a last viewed quote in sessionStorage
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastViewedQuote) {
    quoteDisplay.textContent = lastViewedQuote; // Display last viewed quote if available
  } else {
    showRandomQuote(); // Show a random quote if no last viewed quote exists
  }

  // Event Listeners
  newQuote.addEventListener("click", showRandomQuote);
  document.querySelector("#filterQuote").addEventListener("click", filterQuotesByCategory);
  exportQuotesBtn.addEventListener("click", exportQuotes);
  importFileInput.addEventListener("change", importFromJsonFile);
});
