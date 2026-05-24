(function () {
  const counties = [
    { id: "mombasa", name: "Mombasa", region: "Coast" },
    { id: "kwale", name: "Kwale", region: "Coast" },
    { id: "kilifi", name: "Kilifi", region: "Coast" },
    { id: "tana-river", name: "Tana River", region: "Coast" },
    { id: "lamu", name: "Lamu", region: "Coast" },
    { id: "taita-taveta", name: "Taita-Taveta", region: "Coast" },
    { id: "garissa", name: "Garissa", region: "North Eastern" },
    { id: "wajir", name: "Wajir", region: "North Eastern" },
    { id: "mandera", name: "Mandera", region: "North Eastern" },
    { id: "marsabit", name: "Marsabit", region: "Eastern" },
    { id: "isiolo", name: "Isiolo", region: "Eastern" },
    { id: "meru", name: "Meru", region: "Eastern" },
    { id: "tharaka-nithi", name: "Tharaka-Nithi", region: "Eastern" },
    { id: "embu", name: "Embu", region: "Eastern" },
    { id: "kitui", name: "Kitui", region: "Eastern" },
    { id: "machakos", name: "Machakos", region: "Eastern" },
    { id: "makueni", name: "Makueni", region: "Eastern" },
    { id: "nyandarua", name: "Nyandarua", region: "Central" },
    { id: "nyeri", name: "Nyeri", region: "Central" },
    { id: "kirinyaga", name: "Kirinyaga", region: "Central" },
    { id: "muranga", name: "Murang'a", region: "Central" },
    { id: "kiambu", name: "Kiambu", region: "Central" },
    { id: "turkana", name: "Turkana", region: "Rift Valley" },
    { id: "west-pokot", name: "West Pokot", region: "Rift Valley" },
    { id: "samburu", name: "Samburu", region: "Rift Valley" },
    { id: "trans-nzoia", name: "Trans Nzoia", region: "Rift Valley" },
    { id: "uasin-gishu", name: "Uasin Gishu", region: "Rift Valley" },
    { id: "elgeyo-marakwet", name: "Elgeyo-Marakwet", region: "Rift Valley" },
    { id: "nandi", name: "Nandi", region: "Rift Valley" },
    { id: "baringo", name: "Baringo", region: "Rift Valley" },
    { id: "laikipia", name: "Laikipia", region: "Rift Valley" },
    { id: "nakuru", name: "Nakuru", region: "Rift Valley" },
    { id: "narok", name: "Narok", region: "Rift Valley" },
    { id: "kajiado", name: "Kajiado", region: "Rift Valley" },
    { id: "kericho", name: "Kericho", region: "Rift Valley" },
    { id: "bomet", name: "Bomet", region: "Rift Valley" },
    { id: "kakamega", name: "Kakamega", region: "Western" },
    { id: "vihiga", name: "Vihiga", region: "Western" },
    { id: "bungoma", name: "Bungoma", region: "Western" },
    { id: "busia", name: "Busia", region: "Western" },
    { id: "siaya", name: "Siaya", region: "Nyanza" },
    { id: "kisumu", name: "Kisumu", region: "Nyanza" },
    { id: "homa-bay", name: "Homa Bay", region: "Nyanza" },
    { id: "migori", name: "Migori", region: "Nyanza" },
    { id: "kisii", name: "Kisii", region: "Nyanza" },
    { id: "nyamira", name: "Nyamira", region: "Nyanza" },
    { id: "nairobi", name: "Nairobi", region: "Nairobi" }
  ];

  const regionSelects = Array.from(document.querySelectorAll("[data-regions]"));
  const countySelects = Array.from(document.querySelectorAll("[data-counties]"));
  const previews = {
    register: document.querySelector("#registerCountyPreview"),
    farmer: document.querySelector("#farmerCountyPreview"),
    planting: document.querySelector("#plantingCountyPreview")
  };
  const datasetStatusText = document.querySelector("#datasetStatusText");
  const datasetSource = document.querySelector("#datasetSource");
  const datasetRegionCount = document.querySelector("#datasetRegionCount");
  const datasetCountyCount = document.querySelector("#datasetCountyCount");

  if (!regionSelects.length || !countySelects.length) {
    return;
  }

  const regions = [...new Set(counties.map((item) => item.region))].sort((left, right) => left.localeCompare(right));

  function placeholder(label) {
    return `<option value="">${label}</option>`;
  }

  function fillRegions() {
    const html = placeholder("Select region")
      + regions.map((region) => `<option value="${region}">${region}</option>`).join("");

    regionSelects.forEach((node) => {
      const selected = node.value;
      node.innerHTML = html;
      node.multiple = false;
      node.size = 1;
      node.value = selected || "";
    });
  }

  function fillCountySelect(node, region, selectedCountyId) {
    const options = region
      ? counties.filter((item) => item.region === region).sort((left, right) => left.name.localeCompare(right.name))
      : [];
    const html = placeholder(region ? "Select county" : "Select region first")
      + options.map((item) => `<option value="${item.id}">${item.name}</option>`).join("");

    node.innerHTML = html;
    node.disabled = !region;
    node.multiple = false;
    node.size = 1;
    node.value = selectedCountyId || "";
  }

  function setPreview(node, region) {
    if (!node) {
      return;
    }

    if (!region) {
      node.textContent = "Select a region to see its counties.";
      return;
    }

    const names = counties
      .filter((item) => item.region === region)
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((item) => item.name)
      .join(", ");
    node.textContent = `${region}: ${names}`;
  }

  function syncPair(regionNode, countyNode, previewNode) {
    const currentCounty = counties.find((item) => item.id === countyNode.value);
    const region = regionNode.value || currentCounty?.region || "";

    if (regionNode.value !== region) {
      regionNode.value = region;
    }

    fillCountySelect(countyNode, region, currentCounty?.id || "");
    setPreview(previewNode, region);

    regionNode.addEventListener("change", () => {
      fillCountySelect(countyNode, regionNode.value, "");
      setPreview(previewNode, regionNode.value);
    });
  }

  fillRegions();

  syncPair(document.querySelector("#registerRegion"), document.querySelector("#registerCounty"), previews.register);
  syncPair(document.querySelector("#farmerRegion"), document.querySelector("#farmerCounty"), previews.farmer);
  syncPair(document.querySelector("#plantingRegion"), document.querySelector("#plantingCounty"), previews.planting);

  if (datasetStatusText) {
    datasetStatusText.textContent = "Region and county selectors are active.";
    datasetStatusText.dataset.error = "false";
  }

  if (datasetSource) {
    datasetSource.textContent = "Built-in selector data";
  }

  if (datasetRegionCount) {
    datasetRegionCount.textContent = String(regions.length);
  }

  if (datasetCountyCount) {
    datasetCountyCount.textContent = String(counties.length);
  }
})();
