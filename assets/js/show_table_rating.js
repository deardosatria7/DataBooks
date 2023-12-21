document.addEventListener("DOMContentLoaded", function () {
  let jsonData = []; // Variable to store JSON data
  let startIndex = 0;
  let endIndex = 4; // Misalnya, tampilkan 5 buku per halaman

  // Fetch data from JSON file
  fetch("assets/books_rating.json")
    .then((response) => response.json())
    .then((data) => {
      jsonData = data;
      updateTable();
    })
    .catch((error) => console.error("Error fetching JSON data:", error));

  function updateTable() {
    const table = document.getElementById("json-table");
    table.innerHTML = ""; // Clear existing table content

    const headers = Object.keys(jsonData[0]);

    // Tambahkan kolom "No." pada headers
    headers.unshift("No.");

    const headerRow = table.insertRow(0);

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });

    // Perbarui jumlah buku per halaman
    const bookCountSelect = document.getElementById("bookCount");
    const booksPerPage = parseInt(bookCountSelect.value, 10);

    // Hitung ulang indeks
    startIndex = Math.floor(startIndex / booksPerPage) * booksPerPage;
    endIndex = Math.min(startIndex + booksPerPage - 1, jsonData.length - 1);

    const rowsToShow = jsonData.slice(startIndex, endIndex + 1);

    rowsToShow.forEach((rowData, rowIndex) => {
      const row = table.insertRow();

      headers.forEach((header) => {
        const cell = row.insertCell();

        if (header === "No.") {
          cell.textContent = startIndex + rowIndex + 1; // Nomor urutan global
        } else {
          const cellValue = rowData[header];
          cell.textContent = cellValue;
        }
      });
    });

    // Menampilkan tombol Next jika masih ada halaman berikutnya
    const nextButton = document.getElementById("nextButton");
    nextButton.style.display =
      endIndex < jsonData.length - 1 ? "block" : "none";

    // Menampilkan tombol Previous jika tidak di halaman pertama
    const prevButton = document.getElementById("prevButton");
    prevButton.style.display = startIndex > 0 ? "block" : "none";
  }

  window.nextPage = function () {
    startIndex = endIndex + 1;
    endIndex = Math.min(startIndex + 4, jsonData.length - 1); // Misalnya, tampilkan 5 buku per halaman
    updateTable();
  };

  window.prevPage = function () {
    startIndex = Math.max(0, startIndex - 5); // Misalnya, tampilkan 5 buku per halaman
    endIndex = startIndex + 4;
    updateTable();
  };

  window.sortTable = function () {
    const sortCriteriaSelect = document.getElementById("sortCriteria");
    const currentSortCriteria = sortCriteriaSelect.value;

    if (currentSortCriteria === "default") {
      // Reset data ke urutan awal
      jsonData.sort((a, b) => a.Index - b.Index);
    } else {
      // Lakukan pengurutan berdasarkan kriteria yang dipilih
      jsonData.sort((a, b) => {
        if (currentSortCriteria === "year") {
          return a["Year-Of-Publication"] - b["Year-Of-Publication"];
        } else if (currentSortCriteria === "rating") {
          return b["Book-Rating"] - a["Book-Rating"];
        }
      });
    }

    // Perbarui tabel dengan data yang diurutkan
    updateTable();
  };

  // Add event listener for changes in book count selection
  const bookCountSelect = document.getElementById("bookCount");
  bookCountSelect.addEventListener("change", updateTable);

  // Call updateTable initially to populate the table with default count
  // updateTable(); // Kita panggil setelah mendapatkan data JSON
});
