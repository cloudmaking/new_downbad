document.addEventListener("DOMContentLoaded", () => {
  const fileUpload = document.getElementById("fileUpload");
  const fileNameDisplay = document.getElementById("fileName");
  const statsList = document.getElementById("statsList");
  const downloadBtn = document.getElementById("downloadBtn");
  const exportPdfBtn = document.getElementById("exportPdfBtn");
  const downloadCsvBtn = document.getElementById("downloadCsvBtn");

  let textData = "";
  let statsData = null;

  // Handle file upload
  fileUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
      // Process the file
      parseUploadedFile(file);
    }
  });

  // Handle export PDF
  exportPdfBtn.addEventListener("click", () => {
    if (statsData) {
      exportReportAsPDF();
    }
  });

  // Handle download CSV
  downloadCsvBtn.addEventListener("click", () => {
    if (statsData) {
      downloadDataAsCSV();
    }
  });

  // Handle download report (optional)
  downloadBtn.addEventListener("click", () => {
    if (statsData) {
      exportReportAsPDF();
    }
  });

  // Function to parse uploaded file
  function parseUploadedFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.type === "application/pdf") {
        // Parse PDF content
        parsePDF(e.target.result)
          .then((text) => {
            textData = text;
            processTextData(textData);
          })
          .catch((err) => {
            alert("Error parsing PDF file.");
            console.error(err);
          });
      } else {
        // Parse text content
        textData = e.target.result;
        processTextData(textData);
      }
    };

    if (file.type === "application/pdf") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }

  // Function to process text data and display stats
  function processTextData(text) {
    statsData = analyzeText(text);
    displayStats(statsData);
    // Enable export buttons
    exportPdfBtn.classList.remove("hidden");
    downloadCsvBtn.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
  }

  // Function to display stats
  function displayStats(stats) {
    statsList.innerHTML = "";

    const statsItems = [
      `Word Count: ${stats.wordCount}`,
      `Unique Words: ${stats.uniqueWords}`,
      `Vocabulary Richness (Type-Token Ratio): ${stats.vocabularyRichness.toFixed(
        2
      )}`,
      `Average Word Length: ${stats.averageWordLength.toFixed(2)}`,
      `Letter Count: ${stats.letterCount}`,
      `Sentence Count: ${stats.sentenceCount}`,
      `Average Sentence Length: ${stats.averageSentenceLength.toFixed(
        2
      )} words`,
      `Paragraph Count: ${stats.paragraphCount}`,
      `Readability (Flesch-Kincaid): ${stats.readability.toFixed(2)}`,
      `Sentiment: ${stats.sentiment}`,
      `Sentiment Score: ${stats.sentimentScore}`,
      `Hapax Legomena: ${stats.hapaxLegomena}`,
      `Dis Legomena: ${stats.disLegomena}`,
      `Keyword Density: ${stats.keywordDensity.toFixed(2)}%`,
      `Top 10 Words: ${stats.topWords
        .map((word) => `${word[0]} (${word[1]})`)
        .join(", ")}`,
      `Top 10 Bigrams: ${stats.topBigrams
        .map((bigram) => `${bigram[0]} (${bigram[1]})`)
        .join(", ")}`,
      `Top 10 Letters: ${stats.topLetters
        .map((letter) => `${letter[0].toUpperCase()} (${letter[1]})`)
        .join(", ")}`,
      // Add more statistics as needed
    ];

    statsItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      statsList.appendChild(li);
    });
  }

  // Function to export report as PDF
  function exportReportAsPDF() {
    const docDefinition = {
      content: [
        { text: "QuickViz Report", style: "header" },
        { text: `File: ${fileNameDisplay.textContent}`, style: "subheader" },
        { text: "Text Statistics:", style: "sectionHeader" },
        { ul: Array.from(statsList.children).map((li) => li.textContent) },
        // Additional sections can be added here
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        sectionHeader: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("QuickViz_Report.pdf");
  }

  // Function to download data as CSV
  function downloadDataAsCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Statistic,Value\n";
    Array.from(statsList.children).forEach((li) => {
      const [stat, value] = li.textContent.split(": ");
      csvContent += `${stat},${value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "QuickViz_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});
