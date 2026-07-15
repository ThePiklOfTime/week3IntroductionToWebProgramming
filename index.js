const populationUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/vaerak/11ra.px";
const employmentUrl = "https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/115b.px";

const setupTable = (populationData, employmentData) => {
  const table = document.getElementById("table-body");
  const labels = populationData.dimension.alue_23_20260101.category.label;
  let municapilityArray = [];
  for (const label of Object.values(labels)) { 
    console.log(label);
    municapilityArray.push(label);
  }

  for (let i = 0; i < populationData.value.length; i++) {
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    if (i % 2 === 0) {
      row.style.backgroundColor = "#ffffff";
    } else {
      row.style.backgroundColor = "#f2f2f2";
    }

    const employmentRate = (employmentData.value[i] / populationData.value[i]) * 100;
    cell1.innerHTML = municapilityArray[i];
    cell2.innerHTML = populationData.value[i];
    cell3.innerHTML = employmentData.value[i];
    cell4.innerHTML = employmentRate.toFixed(2) + "%";
    if (employmentRate > 45) {
      row.style.backgroundColor = "abffbd";
    }else if (employmentRate < 25) {
      row.style.backgroundColor = "ff9e9e";
    }
  }
};

const fetchStatFinData = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return await response.json();
};

const initializeCode = async () => {
    const populationBody = await (await fetch("/tiedot/population_query.json")).json();
    const employmentBody = await (await fetch("/tiedot/Employment_query.json")).json();

    const [populationData, employmentData] = await Promise.all([
        fetchStatFinData(populationUrl, populationBody),
        fetchStatFinData(employmentUrl, employmentBody)
    ]);
    console.log("Population Data:", populationData);
    setupTable(populationData, employmentData);
    
}
initializeCode().catch(error => console.error("Error initializing code:", error));
