import { cropProfiles, countyProfiles } from "./data.js";
import { buildForecast, getDefaultPlantingDate } from "./forecast.js";

const form = document.querySelector("#planner-form");
const cropSelect = document.querySelector("#cropType");
const countySelect = document.querySelector("#location");
const plantingDateInput = document.querySelector("#plantingDate");

const outputNodes = {
  harvestWindow: document.querySelector("#harvestWindow"),
  sellWindow: document.querySelector("#sellWindow"),
  recommendationText: document.querySelector("#recommendationText"),
  yieldProjection: document.querySelector("#yieldProjection"),
  revenueProjection: document.querySelector("#revenueProjection"),
  weatherScore: document.querySelector("#weatherScore"),
  weatherNarrative: document.querySelector("#weatherNarrative"),
  smsPreview: document.querySelector("#smsPreview"),
  heroHarvestWindow: document.querySelector("#hero-harvest-window"),
  heroBestPrice: document.querySelector("#hero-best-price"),
  heroRiskLevel: document.querySelector("#hero-risk-level"),
  heroSmsState: document.querySelector("#hero-sms-state"),
  weatherPills: document.querySelector("#weatherPills")
};

function populateSelect(select, items) {
  select.innerHTML = items
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
}

function drawChart(series) {
  const svg = document.querySelector("#priceChart");
  const width = 720;
  const height = 280;
  const padding = { top: 20, right: 24, bottom: 40, left: 54 };
  const maxPrice = Math.max(...series.map((point) => point.price));
  const minPrice = Math.min(...series.map((point) => point.price));
  const xStep = (width - padding.left - padding.right) / (series.length - 1);
  const yRange = Math.max(1, maxPrice - minPrice);

  const coordinates = series.map((point, index) => {
    const x = padding.left + index * xStep;
    const y =
      height -
      padding.bottom -
      ((point.price - minPrice) / yRange) * (height - padding.top - padding.bottom);
    return { ...point, x, y };
  });

  const path = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const lastPoint = coordinates[coordinates.length - 1];
  const area = `${path} L ${lastPoint.x} ${height - padding.bottom} L ${coordinates[0].x} ${height - padding.bottom} Z`;
  const peak = coordinates.reduce((best, point) => (point.price > best.price ? point : best));

  const xLabels = coordinates
    .map(
      (point) => `
        <text x="${point.x}" y="${height - 14}" text-anchor="middle" fill="#6a7b67" font-size="12">
          ${point.label}
        </text>
      `
    )
    .join("");

  const yTicks = Array.from({ length: 4 }, (_, index) => {
    const value = minPrice + (yRange / 3) * index;
    const y =
      height -
      padding.bottom -
      ((value - minPrice) / yRange) * (height - padding.top - padding.bottom);
    return `
      <line x1="${padding.left}" x2="${width - padding.right}" y1="${y}" y2="${y}" stroke="rgba(49,92,57,0.1)" />
      <text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" fill="#6a7b67" font-size="12">
        ${Math.round(value).toLocaleString()}
      </text>
    `;
  }).join("");

  const dots = coordinates
    .map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4.5" fill="#315c39"></circle>`)
    .join("");

  svg.innerHTML = `
    <defs>
      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(49, 92, 57, 0.34)"></stop>
        <stop offset="100%" stop-color="rgba(49, 92, 57, 0.02)"></stop>
      </linearGradient>
    </defs>
    ${yTicks}
    <path d="${area}" fill="url(#chartFill)"></path>
    <path d="${path}" fill="none" stroke="#315c39" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
    ${dots}
    <circle cx="${peak.x}" cy="${peak.y}" r="8" fill="#e08a2e" stroke="#fff8ef" stroke-width="3"></circle>
    <text x="${peak.x}" y="${peak.y - 14}" text-anchor="middle" fill="#85561d" font-size="12" font-weight="700">
      Peak
    </text>
    ${xLabels}
  `;
}

function renderForecast(result, channel) {
  outputNodes.harvestWindow.textContent = result.harvestWindow;
  outputNodes.sellWindow.textContent = result.bestWeekText;
  outputNodes.recommendationText.textContent = result.recommendation;
  outputNodes.yieldProjection.textContent = result.estimatedYieldText;
  outputNodes.revenueProjection.textContent = result.revenueProjectionText;
  outputNodes.weatherScore.textContent = result.weatherScore;
  outputNodes.weatherNarrative.textContent = result.weatherNarrative;
  outputNodes.smsPreview.textContent = result.smsPreview;
  outputNodes.heroHarvestWindow.textContent = result.harvestWindow;
  outputNodes.heroBestPrice.textContent = result.bestPriceText;
  outputNodes.heroRiskLevel.textContent = result.riskLabel;
  outputNodes.heroSmsState.textContent =
    channel === "app" ? "Optional" : channel === "sms" ? "Primary" : "Enabled";
  outputNodes.weatherPills.innerHTML = result.weatherTags
    .map((tag) => `<span>${tag}</span>`)
    .join("");
  document.documentElement.style.setProperty("--meter-angle", result.weatherScore);
  drawChart(result.priceSeries);
}

function getCurrentSelection() {
  const crop = cropProfiles.find((item) => item.id === cropSelect.value) ?? cropProfiles[0];
  const county = countyProfiles.find((item) => item.id === countySelect.value) ?? countyProfiles[0];
  const farmerName = document.querySelector("#farmerName").value.trim();
  const plantingDate = plantingDateInput.value || getDefaultPlantingDate();
  const farmSize = Number(document.querySelector("#farmSize").value) || 1;
  const channel = document.querySelector("#channel").value;

  return { crop, county, farmerName, plantingDate, farmSize, channel };
}

function computeAndRender() {
  const selection = getCurrentSelection();
  const result = buildForecast(selection);
  renderForecast(result, selection.channel);
}

populateSelect(cropSelect, cropProfiles);
populateSelect(countySelect, countyProfiles);
plantingDateInput.value = getDefaultPlantingDate();
form.addEventListener("submit", (event) => {
  event.preventDefault();
  computeAndRender();
});

["change", "input"].forEach((eventName) => {
  form.addEventListener(eventName, () => {
    computeAndRender();
  });
});

computeAndRender();
