document.addEventListener("DOMContentLoaded", function () {
    const uniqueNames = {};
  
    fetch("/records")
      .then((response) => response.json())
      .then((names) => {
        const select = document.getElementById("name");
        names.forEach((name) => {
          if (!uniqueNames[name]) {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
            uniqueNames[name] = true;
          }
        });
      })
      .catch((error) => console.error("Error fetching names:", error));
  });
  
  
  let fTotalweightQL = document.getElementById("totalWeightQL");
  let fTotalAmountQL = document.getElementById("totalAmountQL");
  let fTotalweightGR = document.getElementById("totalWeightGR");
  let fTotalAmountGR = document.getElementById("totalAmountGR");
  let commi = document.getElementById("commiosion");
  let printiv = document.getElementById("print");
  let save = document.getElementById("save");
  let netpaid = document.getElementById("netpay");
  let paid = document.getElementById("paid");
  let prepaid = document.getElementById("prepaid");
  let unpaid = document.getElementById("unpaid");
  var rateindex = 0,
    rateindexGen = 0,
    weightholderQL = 0,
    weightholderGR = 0,
    rateholderQL = 0,
    rateholderGR = 0;
  
  let selectedStartDates = [];
  let selectedEndDates = [];
  var tabledata = [];
  var gentabledata = [];
  
  
  // making the btn to print
  printiv.addEventListener("click", () => {
    if ("" == commi.value) {
      alert("enter the commision value");
      commi.focus();
    } else {
      generateAndPrintPDF();
    }
  });
  // making the btn to download
  save.addEventListener("click", saveinvoice);
  
  
  // add row to rate table
  function addRow() {
    var name = document.getElementById("name").value;
    var rate = document.getElementById("rate").value;
    var fromDate = document.getElementById("from").value;
    var toDate = document.getElementById("to").value;
    rateindex++;
  
    if (
      selectedStartDates.includes(fromDate) ||
      selectedEndDates.includes(toDate)
    ) {
      alert("Start date or end date already selected for another row.");
      return;
    }
    selectedStartDates.push(fromDate);
    selectedEndDates.push(toDate);
  
    fetch("/getrecords")
      .then((response) => response.json())
      .then((data) => {
        let totalWeight = 0;
        data.forEach((record) => {
          const recordDate = record.date;
          if (
            record.name === name &&
            recordDate >= fromDate &&
            recordDate <= toDate
          ) {
            totalWeight += record.weight;
          }
        });
        const tableBody = document.querySelector("#rateTable");
        const newRow = tableBody.insertRow();
        const rate1 = newRow.insertCell();
        const rateCell = newRow.insertCell();
        const startDateCell = newRow.insertCell();
        const endDateCell = newRow.insertCell();
        const totalWeightCell = newRow.insertCell();
        const netAmountCell = newRow.insertCell();
  
        rate1.innerHTML = `Rate ${rateindex}`;
        rateCell.innerHTML = `${rate}`;
        startDateCell.innerHTML = `${fromDate}`;
        endDateCell.innerHTML = `${toDate}`;
        totalWeightCell.innerHTML = `${totalWeight}`;
        netAmountCell.innerHTML = totalWeight * rate;
        weightholderQL += totalWeight;
        fTotalweightQL.value = weightholderQL;
        rateholderQL += totalWeight * rate;
        fTotalAmountQL.value = rateholderQL;
  
        var datainsert = [];
        datainsert.push(
          `Rate ${rateindex}`,
          rate,
          fromDate,
          toDate,
          totalWeight,
          totalWeight * rate
        );
        tabledata.push(datainsert);
      })
      .catch((error) => console.error("Error:", error));
  }
  
  
  // add row to genral table
  function addGeneralRow() {
    var name = document.getElementById("name").value;
    var rate = document.getElementById("rateGen").value;
    var fromDate = document.getElementById("Genfrom").value;
    var toDate = document.getElementById("Gento").value;
    rateindexGen++;
  
    if (
      selectedStartDates.includes(fromDate) ||
      selectedEndDates.includes(toDate)
    ) {
      alert("Start date or end date already selected for another row.");
      return;
    }
    selectedStartDates.push(fromDate);
    selectedEndDates.push(toDate);
  
    fetch("/getrecords")
      .then((response) => response.json())
      .then((data) => {
        let totalWeight = 0;
        data.forEach((record) => {
          const recordDate = record.date;
          if (
            record.name === name &&
            recordDate >= fromDate &&
            recordDate <= toDate
          ) {
            totalWeight += record.weight;
          }
        });
        const tableBody = document.getElementById("genTable");
        const newRow = tableBody.insertRow();
        const rate1 = newRow.insertCell();
        const rateCell = newRow.insertCell();
        const startDateCell = newRow.insertCell();
        const endDateCell = newRow.insertCell();
        const totalWeightCell = newRow.insertCell();
        const netAmountCell = newRow.insertCell();
  
        rate1.innerHTML = `Rate ${rateindexGen}`;
        rateCell.innerHTML = `${rate}`;
        startDateCell.innerHTML = `${fromDate}`;
        endDateCell.innerHTML = `${toDate}`;
        totalWeightCell.innerHTML = `${totalWeight}`;
        netAmountCell.innerHTML = totalWeight * rate;
        weightholderGR += totalWeight;
        fTotalweightGR.value = weightholderGR;
        rateholderGR += totalWeight * rate;
        fTotalAmountGR.value = rateholderGR;
  
        var datainsert = [];
        datainsert.push(
          `Rate ${rateindexGen}`,
          rate,
          fromDate,
          toDate,
          totalWeight,
          totalWeight * rate
        );
        gentabledata.push(datainsert);
      })
      .catch((error) => console.error("Error:", error));
  }
  
  
  
  // creat a pdf
  var startY = 10;
  var startx = 10;
  var doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("Invoice", startx * 10, startY, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("Invoice Number: INV-001", startx, (startY += 10));
  doc.text("Agent Name: Sam", startx, (startY += 5));
  doc.text("Agent No.: +911234567890", startx, (startY += 5));
  doc.text(
    "Date: " + new Date().toLocaleDateString(),
    startx * 15,
    startY - 10
  );
  doc.text(
    `Farmer Name: ${document.getElementById("name").value}`,
    startx,
    (startY += 10)
  );
  
  var headers = [
    "Rate",
    "Rate for qualityCell",
    "From",
    "To",
    "Total Weight",
    "Net Amount",
  ];
  var headergen = [
    "Rate",
    "Rate for Genral Cell",
    "From",
    "To",
    "Total Weight",
    "Net Amount",
  ];
  doc.autoTable({
    startY: 45,
    head: [headers],
    body: tabledata,
    headStyles: {
      fillColor: [76, 175, 80],
    },
  });
  
  var firstTableHeight = doc.previousAutoTable.finalY || 0;
  doc.setFontType("bold");
  doc.setFontSize(15);
  doc.text(`Genral Rate`, startx + 5, firstTableHeight + 5.9);
  doc.autoTable({
    startY: firstTableHeight + 10,
    head: [headergen],
    body: gentabledata,
    headStyles: {
      fillColor: [76, 175, 80],
    },
  });
  var sectable = doc.previousAutoTable.finalY;
  doc.setFontSize(15);
  
  doc.text(`Total weight (Quality Leaves): ${fTotalweightQL.value} `, startx, (sectable += 10));
  doc.text(`Total amount (Quality Leaves): ${fTotalAmountQL.value} `, startx, (sectable += 7));
  doc.text(`Total weight (General Rates): ${fTotalweightGR.value} `, startx, (sectable += 7));
  doc.text(`Total amount (General Rates): ${fTotalAmountGR.value} `, startx, (sectable += 7));
  doc.text(`Commision : ${commi.value} `, startx, (sectable += 7));
  doc.text(`Net Payable Amount : ${netpaid.value} `, startx, (sectable += 7));
  doc.text(`Paid Amount : ${paid.value} `, startx, (sectable += 7));
  doc.text(`Unpaid Amount : ${unpaid.value} `, startx, (sectable += 7));
  
  
  // function to print the pdf 
  function generateAndPrintPDF() {
    doc.autoPrint();
    var pdfData = doc.output("datauristring");
    var iframe = document.createElement("iframe");
    iframe.style.visibility = "hidden";
    iframe.src = pdfData;
    document.body.appendChild(iframe);
    iframe.onload = function () {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };
  }
  
  
  // function to download the pdf 
  function saveinvoice() {
    doc.save('sdasd.pdf');
  }
