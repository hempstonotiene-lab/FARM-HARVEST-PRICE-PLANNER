import {
    MAX_FARM_SIZE_ACRES,
    MIN_FARM_SIZE_ACRES,
    MIN_NAME_LENGTH,
    MIN_PASSWORD_LENGTH,
    isValidEmail,
    isValidFarmSize,
    isValidName,
    isValidPhoneNumber,
    isValidPassword,
    isValidPlantingDate
} from "../src/validation-rules.js";

const tokenKey = "farmPlannerToken";
const farmerKey = "farmPlannerFarmer";
const localeKey = "farmPlannerLocale";

const translations = {
    en: {
        pageTitle: "Smart Farming Assistant",
        heroEyebrow: "Mobile agricultural decision support",
        heroShortcutGuest: "Start here",
        heroShortcutSignedIn: "Open planner",
        heroTag: "Harvest prediction, market timing, weather insight, and SMS support",
        heroText:
            "Smart Farming Assistant turns the proposal into a working planner that combines crop records, county market prices, weather signals, and SMS-ready recommendations so farmers can decide when to harvest and when to sell.",
        heroPrimaryAction: "Create account",
        heroSecondaryAction: "Sign in",
        heroSupportNote:
            "Built around the proposal goals: personalized predictions, simple charts, weather-aware recommendations, and inclusive SMS fallback for farmers without smartphones.",
        quickSummary: "Quick summary",
        metricCropMaturity: "Crop maturity",
        metricBestPrice: "Best expected price",
        metricWeatherRisk: "Weather risk",
        metricSmsSupport: "SMS support",
        navAccess: "Access",
        navCapabilities: "Capabilities",
        navWorkflow: "Workflow",
        navInsights: "Insights",
        globalReadyMessage: "Ready to plan. Register or sign in to unlock full forecasting and SMS alerts.",
        overviewAuthLabel: "Auth state",
        overviewAuthCopy: "Shows whether a farmer account is currently signed in.",
        overviewRecordsLabel: "Saved records",
        overviewRecordsCopy: "Total planting records available for forecasting.",
        overviewCropLabel: "Latest crop",
        overviewCropCopy: "Most recent crop from your saved planting history.",
        overviewDatasetLabel: "Dataset source",
        overviewDatasetCopy: "Current source for regions, counties, and crops.",
        featureDecisionEyebrow: "Decision support",
        featureDecisionTitle: "Predict harvest timing with farmer-specific input",
        featureDecisionCopy:
            "The app uses crop, planting date, county, and farm size details to build a more personal harvest and selling outlook instead of generic farming tips.",
        featureMarketEyebrow: "Market intelligence",
        featureMarketTitle: "Combine price history, weather, and selling advice",
        featureMarketCopy:
            "Proposal goals around forecasting are reflected through price charts, weather readiness, revenue estimates, and a clear recommendation on the best selling window.",
        featureAccessEyebrow: "Inclusive access",
        featureAccessTitle: "Support app users and farmers who rely on SMS",
        featureAccessCopy:
            "The experience now highlights bilingual onboarding, GPS-assisted county selection, local dataset fallback, and SMS-ready alerts so support reaches more farmers.",
        workflowEyebrow: "Proposal workflow",
        workflowTitle: "How the Smart Farming Assistant works",
        workflowInputTitle: "1. Farmer input",
        workflowInputCopy: "Capture crop, planting date, location, and profile details through a simple mobile-first form.",
        workflowEngineTitle: "2. Prediction engine",
        workflowEngineCopy: "Blend crop rules, county climate patterns, live weather summaries, and market datasets on the backend.",
        workflowInsightTitle: "3. Decision insight",
        workflowInsightCopy:
            "Return harvest windows, expected revenue, market peaks, and clear selling recommendations with simple charts.",
        workflowReachTitle: "4. Inclusive delivery",
        workflowReachCopy:
            "Prepare message previews and SMS alerts so the same guidance can reach smartphone and basic-phone farmers.",
        accountEyebrow: "Account",
        accountTitle: "Create a farmer account",
        registerButton: "Register",
        dataStatusEyebrow: "Data status",
        dataStatusTitle: "Regions and counties",
        reloadDatasetsButton: "Reload region and county lists",
        signInEyebrow: "Sign in",
        signInTitle: "Access your records",
        loginButton: "Login",
        authMessageDefault: "Register or sign in to unlock forecasts and records.",
        debugEyebrow: "Debug",
        debugTitle: "Auth and API messages",
        debugDefault: "No debug events yet.",
        logoutButton: "Logout",
        notSignedIn: "Not signed in",
        welcomeBack: "Welcome back, {name}",
        signedIn: "Signed in",
        guestMode: "Guest mode",
        ready: "Ready",
        signInShort: "Sign in",
        waiting: "Waiting",
        unknown: "Unknown",
        noRecordsYet: "No records yet",
        noPlantingRecordsRow: "No planting records yet.",
        noPlantingRecordSaved: "No planting record saved yet.",
        savePlantingAndForecast: "Save planting and forecast",
        updatePlantingRecord: "Update planting record",
        editingPlantingRecord: "Editing planting record.",
        plantingRecordNotFound: "Planting record not found.",
        noForecastYet: "No forecast yet",
        forecastPrompt: "Save a planting record to generate a real forecast.",
        weatherPending: "Weather details will appear here after a forecast is generated.",
        smsPending: "SMS preview will appear here after login and forecast generation.",
        recentTrendPending: "Recent county price movement will appear after a forecast is generated.",
        projectedAdvicePending: "Projected selling advice will appear after a forecast is generated.",
        addPhone: "Add phone",
        closestCountySuffix: " (closest available county dataset).",
        bestProjectedPoint: "Best projected selling point is {label} at about {price} per unit.",
        weekAfterHarvest: "Week {week} after harvest",
        harvestWeek: "Harvest week",
        smsPreviewTemplate:
            "{name}, {crop} harvest is expected between {harvestStart} and {harvestEnd}. Best selling time: {bestWeek}.",
        heroHarvestDays: "{days} days",
        weatherPillCounty: "{county} county",
        weatherPillCrop: "{crop} crop",
        weatherPillRisk: "{risk} weather risk",
        datasetsReady: "Region, county, and crop lists are ready to use.",
        datasetsLoading: "Loading region and county lists...",
        datasetSourceLoading: "Loading",
        editButton: "Edit",
        deleteButton: "Delete",
        acresLabel: "acres",
        latestRecordTemplate: "{crop} in {county}, planted on {date}."
    },
    sw: {
        pageTitle: "Msaidizi wa Kilimo Mahiri",
        heroEyebrow: "Msaada wa maamuzi ya kilimo kwa simu",
        heroShortcutGuest: "Anza hapa",
        heroShortcutSignedIn: "Fungua mpangaji",
        heroTag: "Utabiri wa mavuno, muda wa soko, hali ya hewa, na usaidizi wa SMS",
        heroText:
            "Msaidizi wa Kilimo Mahiri hubadilisha mapendekezo ya mradi kuwa mpangaji unaofanya kazi unaounganisha rekodi za mazao, bei za kaunti, taarifa za hali ya hewa, na mapendekezo yanayotumwa kwa SMS ili mkulima ajue wakati wa kuvuna na kuuza.",
        heroPrimaryAction: "Fungua akaunti",
        heroSecondaryAction: "Ingia",
        heroSupportNote:
            "Imejengwa kulingana na malengo ya proposal: utabiri wa binafsi, chati rahisi, mapendekezo yanayoangalia hali ya hewa, na njia ya SMS kwa wakulima wasiotumia simu janja.",
        quickSummary: "Muhtasari wa haraka",
        metricCropMaturity: "Ukomavu wa zao",
        metricBestPrice: "Bei bora inayotarajiwa",
        metricWeatherRisk: "Hatari ya hali ya hewa",
        metricSmsSupport: "Usaidizi wa SMS",
        navAccess: "Upatikanaji",
        navCapabilities: "Uwezo",
        navWorkflow: "Mtiririko",
        navInsights: "Uchambuzi",
        globalReadyMessage: "Tayari kupanga. Jisajili au ingia ili kufungua utabiri kamili na arifa za SMS.",
        overviewAuthLabel: "Hali ya akaunti",
        overviewAuthCopy: "Huonyesha kama akaunti ya mkulima imeingia sasa.",
        overviewRecordsLabel: "Rekodi zilizohifadhiwa",
        overviewRecordsCopy: "Jumla ya rekodi za upandaji zinazoweza kutumika kwa utabiri.",
        overviewCropLabel: "Zao la hivi karibuni",
        overviewCropCopy: "Zao la mwisho kutoka kwenye historia yako ya upandaji.",
        overviewDatasetLabel: "Chanzo cha data",
        overviewDatasetCopy: "Chanzo cha sasa cha maeneo, kaunti, na mazao.",
        featureDecisionEyebrow: "Msaada wa maamuzi",
        featureDecisionTitle: "Tabiri muda wa mavuno kwa taarifa za mkulima binafsi",
        featureDecisionCopy:
            "Programu hutumia aina ya zao, tarehe ya kupanda, kaunti, na ukubwa wa shamba kutengeneza mwonekano binafsi wa mavuno na mauzo badala ya ushauri wa jumla.",
        featureMarketEyebrow: "Akili ya soko",
        featureMarketTitle: "Unganisha historia ya bei, hali ya hewa, na ushauri wa mauzo",
        featureMarketCopy:
            "Malengo ya proposal yanaonekana kupitia chati za bei, utayari wa hali ya hewa, makadirio ya mapato, na pendekezo wazi la muda bora wa kuuza.",
        featureAccessEyebrow: "Upatikanaji jumuishi",
        featureAccessTitle: "Saidia watumiaji wa app na wakulima wanaotegemea SMS",
        featureAccessCopy:
            "Uzoefu huu unaonyesha mwanzo wa lugha mbili, uteuzi wa kaunti kwa GPS, data ya ndani ya akiba, na arifa za SMS ili kuwafikia wakulima wengi zaidi.",
        workflowEyebrow: "Mtiririko wa proposal",
        workflowTitle: "Jinsi Msaidizi wa Kilimo Mahiri unavyofanya kazi",
        workflowInputTitle: "1. Taarifa za mkulima",
        workflowInputCopy: "Kusanya zao, tarehe ya kupanda, eneo, na taarifa za profaili kupitia fomu rahisi ya simu.",
        workflowEngineTitle: "2. Injini ya utabiri",
        workflowEngineCopy: "Changanya sheria za mazao, hali za kaunti, muhtasari wa hali ya hewa, na data za soko kwenye backend.",
        workflowInsightTitle: "3. Majibu ya uamuzi",
        workflowInsightCopy: "Rudisha dirisha la mavuno, mapato yanayotarajiwa, kilele cha bei, na ushauri wa wazi kwa kutumia chati rahisi.",
        workflowReachTitle: "4. Uwasilishaji jumuishi",
        workflowReachCopy: "Tayarisha mwonekano wa ujumbe na arifa za SMS ili ushauri ule ule uwafikie watumiaji wa simu janja na simu za kawaida.",
        accountEyebrow: "Akaunti",
        accountTitle: "Fungua akaunti ya mkulima",
        registerButton: "Jisajili",
        dataStatusEyebrow: "Hali ya data",
        dataStatusTitle: "Maeneo na kaunti",
        reloadDatasetsButton: "Pakia upya orodha ya maeneo na kaunti",
        signInEyebrow: "Ingia",
        signInTitle: "Fikia rekodi zako",
        loginButton: "Ingia",
        authMessageDefault: "Jisajili au ingia ili kufungua utabiri na rekodi.",
        debugEyebrow: "Ufuatiliaji",
        debugTitle: "Ujumbe wa uthibitisho na API",
        debugDefault: "Hakuna matukio ya ufuatiliaji bado.",
        logoutButton: "Toka",
        notSignedIn: "Hujaingia",
        welcomeBack: "Karibu tena, {name}",
        signedIn: "Umeingia",
        guestMode: "Hali ya mgeni",
        ready: "Tayari",
        signInShort: "Ingia",
        waiting: "Subiri",
        unknown: "Haijulikani",
        noRecordsYet: "Bado hakuna rekodi",
        noPlantingRecordsRow: "Bado hakuna rekodi za upandaji.",
        noPlantingRecordSaved: "Bado hakuna rekodi ya upandaji iliyohifadhiwa.",
        savePlantingAndForecast: "Hifadhi upandaji na utabiri",
        updatePlantingRecord: "Sasisha rekodi ya upandaji",
        editingPlantingRecord: "Unahariri rekodi ya upandaji.",
        plantingRecordNotFound: "Rekodi ya upandaji haijapatikana.",
        noForecastYet: "Bado hakuna utabiri",
        forecastPrompt: "Hifadhi rekodi ya upandaji ili kupata utabiri halisi.",
        weatherPending: "Maelezo ya hali ya hewa yataonekana hapa baada ya kutengeneza utabiri.",
        smsPending: "Mwonekano wa SMS utaonekana hapa baada ya kuingia na kutengeneza utabiri.",
        recentTrendPending: "Mabadiliko ya bei ya kaunti yataonekana hapa baada ya kutengeneza utabiri.",
        projectedAdvicePending: "Ushauri wa kuuza utaonekana hapa baada ya kutengeneza utabiri.",
        addPhone: "Ongeza simu",
        closestCountySuffix: " (data ya kaunti iliyo karibu zaidi).",
        bestProjectedPoint: "Kilele bora cha kuuza kinatarajiwa kuwa {label} kwa takriban {price} kwa kila kipimo.",
        weekAfterHarvest: "Wiki ya {week} baada ya mavuno",
        harvestWeek: "Wiki ya mavuno",
        smsPreviewTemplate:
            "{name}, mavuno ya {crop} yanatarajiwa kati ya {harvestStart} na {harvestEnd}. Muda bora wa kuuza: {bestWeek}.",
        heroHarvestDays: "siku {days}",
        weatherPillCounty: "kaunti ya {county}",
        weatherPillCrop: "zao la {crop}",
        weatherPillRisk: "hatari ya hali ya hewa: {risk}",
        datasetsReady: "Orodha ya maeneo, kaunti, na mazao iko tayari kutumika.",
        datasetsLoading: "Inapakia orodha ya maeneo na kaunti...",
        datasetSourceLoading: "Inapakia",
        editButton: "Hariri",
        deleteButton: "Futa",
        acresLabel: "eka",
        latestRecordTemplate: "{crop} katika {county}, ilipandwa tarehe {date}."
    }
};

const embeddedCounties = [
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

const embeddedCrops = [
    { id: "maize", name: "Maize", regions: ["Central", "Eastern", "Rift Valley", "Western", "Nyanza"] },
    { id: "beans", name: "Beans", regions: ["Central", "Eastern", "Rift Valley", "Western", "Nyanza"] },
    {
        id: "tomatoes",
        name: "Tomatoes",
        regions: ["Coast", "Eastern", "Central", "Rift Valley", "Western", "Nyanza", "Nairobi"]
    },
    { id: "onions", name: "Onions", regions: ["Eastern", "Central", "Rift Valley", "Western", "Nyanza"] },
    { id: "sorghum", name: "Sorghum", regions: ["Eastern", "North Eastern", "Rift Valley", "Nyanza", "Coast"] }
];

const api = {
    token: localStorage.getItem(tokenKey) || "",
    async request(path, options = {}) {
        const response = await fetch(path, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
                ...(options.headers || {})
            }
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(payload.error || "Request failed.");
        }
        return payload;
    }
};

const state = {
    counties: [],
    regions: [],
    crops: [],
    marketPrices: [],
    farmer: JSON.parse(localStorage.getItem(farmerKey) || "null"),
    plantings: [],
    forecast: null,
    editingPlantingId: null,
    datasetSource: "Loading",
    userLocation: null,
    locale: localStorage.getItem(localeKey) || "en"
};

const el = {
    authSection: document.querySelector("#auth"),
    heroSection: document.querySelector(".hero"),
    heroShortcut: document.querySelector("#heroShortcut"),
    quickStrip: document.querySelector(".quick-strip"),
    plannerSection: document.querySelector("#planner"),
    insightsSection: document.querySelector("#insights"),
    localeButtons: document.querySelectorAll("[data-set-locale]"),
    authStatus: document.querySelector("#authStatus"),
    authMessage: document.querySelector("#authMessage"),
    globalMessage: document.querySelector("#globalMessage"),
    debugText: document.querySelector("#debugText"),
    registerForm: document.querySelector("#registerForm"),
    loginForm: document.querySelector("#loginForm"),
    logoutButton: document.querySelector("#logoutButton"),
    profileForm: document.querySelector("#profileForm"),
    plantingForm: document.querySelector("#plantingForm"),
    plantingSubmitButton: document.querySelector("#plantingSubmitButton"),
    clearPlantingFilters: document.querySelector("#clearPlantingFilters"),
    cancelEditButton: document.querySelector("#cancelEditButton"),
    smsButton: document.querySelector("#sendSmsButton"),
    locateMarketsButton: document.querySelector("#locateMarketsButton"),
    cropSelects: document.querySelectorAll("[data-crops]"),
    regionSelects: document.querySelectorAll("[data-regions]"),
    countySelects: document.querySelectorAll("[data-counties]"),
    registerRegion: document.querySelector("#registerRegion"),
    registerCounty: document.querySelector("#registerCounty"),
    registerCountyPreview: document.querySelector("#registerCountyPreview"),
    reloadDatasetsButton: document.querySelector("#reloadDatasetsButton"),
    datasetStatusText: document.querySelector("#datasetStatusText"),
    datasetSource: document.querySelector("#datasetSource"),
    datasetRegionCount: document.querySelector("#datasetRegionCount"),
    datasetCountyCount: document.querySelector("#datasetCountyCount"),
    datasetCropCount: document.querySelector("#datasetCropCount"),
    overviewAuthState: document.querySelector("#overviewAuthState"),
    overviewRecordCount: document.querySelector("#overviewRecordCount"),
    overviewLatestCrop: document.querySelector("#overviewLatestCrop"),
    overviewDatasetSource: document.querySelector("#overviewDatasetSource"),
    farmerRegion: document.querySelector("#farmerRegion"),
    farmerCountyPreview: document.querySelector("#farmerCountyPreview"),
    plantingRows: document.querySelector("#plantingTableBody"),
    latestRecord: document.querySelector("#latestRecord"),
    marketLocationStatus: document.querySelector("#marketLocationStatus"),
    nearbyMarketsList: document.querySelector("#nearbyMarketsList"),
    farmerName: document.querySelector("#farmerName"),
    farmerEmail: document.querySelector("#farmerEmail"),
    farmerPhone: document.querySelector("#farmerPhone"),
    plantingCrop: document.querySelector("#plantingCrop"),
    climateChart: document.querySelector("#climateChart"),
    cropRecommendationHint: document.querySelector("#cropRecommendationHint"),
    plantingRegion: document.querySelector("#plantingRegion"),
    plantingCounty: document.querySelector("#plantingCounty"),
    plantingCountyPreview: document.querySelector("#plantingCountyPreview"),
    farmerCounty: document.querySelector("#farmerCounty"),
    harvestWindow: document.querySelector("#harvestWindow"),
    sellWindow: document.querySelector("#sellWindow"),
    recommendation: document.querySelector("#recommendationText"),
    yield: document.querySelector("#yieldProjection"),
    revenue: document.querySelector("#revenueProjection"),
    weatherScore: document.querySelector("#weatherScore"),
    weatherNarrative: document.querySelector("#weatherNarrative"),
    smsPreview: document.querySelector("#smsPreview"),
    heroHarvest: document.querySelector("#hero-harvest-window"),
    heroPrice: document.querySelector("#hero-best-price"),
    heroRisk: document.querySelector("#hero-risk-level"),
    heroSms: document.querySelector("#hero-sms-state"),
    weatherPills: document.querySelector("#weatherPills"),
    priceChart: document.querySelector("#priceChart"),
    historyChart: document.querySelector("#historyChart"),
    historyTrendValue: document.querySelector("#historyTrendValue"),
    historyTrendText: document.querySelector("#historyTrendText"),
    forecastPeakValue: document.querySelector("#forecastPeakValue"),
    forecastPeakText: document.querySelector("#forecastPeakText"),
    chartTooltip: document.querySelector("#chartTooltip")
};

function t(key, params = {}) {
    const bundle = translations[state.locale] || translations.en;
    const template = bundle[key] || translations.en[key] || key;
    return template.replace(/\{(\w+)\}/g, (_match, token) => String(params[token] ?? ""));
}

function applyTranslations() {
    document.documentElement.lang = state.locale === "sw" ? "sw" : "en";
    document.title = t("pageTitle");

    document.querySelectorAll("[data-i18n]").forEach((node) => {
        node.textContent = t(node.dataset.i18n);
    });

    el.localeButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.setLocale === state.locale);
    });
}

function setLocale(locale) {
    state.locale = translations[locale] ? locale : "en";
    localStorage.setItem(localeKey, state.locale);
    applyTranslations();
    updateSignedInView();
    updateOverview();
    renderProfile();
    renderPlantings();
    renderForecast();
}

applyTranslations();

function msg(text, isError = false) {
    if (el.globalMessage) {
        el.globalMessage.textContent = text;
        el.globalMessage.dataset.error = isError ? "true" : "false";
    }
    el.authMessage.textContent = text;
    el.authMessage.dataset.error = isError ? "true" : "false";
}

function debugLog(title, detail = "") {
    const timestamp = new Date().toLocaleTimeString("en-KE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const logMessage = `[${timestamp}] ${title}${detail ? ` | ${detail}` : ""}`;
    el.debugText.textContent = logMessage;
    el.debugText.dataset.error = /fail|error|invalid|missing|unauthorized/i.test(logMessage) ? "true" : "false";
}

/**
 * Disables or enables interactive forms during data loading.
 */
function setFormsLoading(isLoading) {
    const forms = [el.registerForm, el.loginForm, el.profileForm, el.plantingForm];
    forms.forEach((form) => {
        if (!form) return;
        const elements = form.querySelectorAll("input, select, button, textarea");
        elements.forEach((node) => (node.disabled = isLoading));
    });
}

function persistFarmer(farmer) {
    state.farmer = farmer || null;

    if (farmer) {
        localStorage.setItem(farmerKey, JSON.stringify(farmer));
        return;
    }

    localStorage.removeItem(farmerKey);
}

function updateSignedInView() {
    const signedIn = Boolean(state.farmer && api.token);
    document.body.classList.toggle("is-auth-mode", !signedIn);

    if (el.authSection) el.authSection.classList.toggle("is-hidden", signedIn);
    if (el.heroSection) el.heroSection.classList.remove("is-hidden");
    if (el.quickStrip) el.quickStrip.classList.toggle("is-hidden", !signedIn);
    if (el.plannerSection) el.plannerSection.classList.toggle("is-hidden", !signedIn);
    if (el.insightsSection) el.insightsSection.classList.toggle("is-hidden", !signedIn);

    if (el.heroShortcut) {
        el.heroShortcut.href = signedIn ? "#planner" : "#auth";
        el.heroShortcut.textContent = signedIn ? t("heroShortcutSignedIn") : t("heroShortcutGuest");
    }
}

function getPlantingNotesValue() {
    return document.querySelector("#plantingNotes")?.value || "";
}

function scrollToInsights() {
    document.querySelector("#insights")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setDatasetStatus({ text, source, regionCount, countyCount, cropCount, isError = false }) {
    state.datasetSource = source;
    el.datasetStatusText.textContent = text;
    el.datasetStatusText.dataset.error = isError ? "true" : "false";
    el.datasetSource.textContent = source;
    el.datasetRegionCount.textContent = String(regionCount);
    el.datasetCountyCount.textContent = String(countyCount);
    el.datasetCropCount.textContent = String(cropCount);
    updateOverview();
}

function updateOverview() {
    if (!el.overviewAuthState || !el.overviewRecordCount || !el.overviewLatestCrop || !el.overviewDatasetSource) {
        return;
    }

    const signedIn = Boolean(state.farmer && api.token);
    el.overviewAuthState.textContent = signedIn ? t("signedIn") : t("guestMode");
    el.overviewRecordCount.textContent = String(state.plantings.length);
    el.overviewDatasetSource.textContent = state.datasetSource;

    const latestPlanting = state.plantings[0];
    if (!latestPlanting) {
        el.overviewLatestCrop.textContent = t("noRecordsYet");
        return;
    }

    const cropName = state.crops.find((entry) => entry.id === latestPlanting.cropId)?.name || latestPlanting.cropId;
    el.overviewLatestCrop.textContent = cropName;
}

function money(value) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0
    }).format(value || 0);
}

function prettyDate(value) {
    return new Intl.DateTimeFormat("en-KE", {
        month: "long",
        day: "numeric",
        year: "numeric"
    }).format(new Date(value));
}

function fillSelects(items, nodes, placeholder) {
    const sortedItems = [...items].sort((left, right) => left.name.localeCompare(right.name));
    const html = [`<option value="" disabled selected>${placeholder}</option>`]
        .concat(sortedItems.map((item) => `<option value="${item.id}">${item.name}</option>`))
        .join("");
    nodes.forEach((node) => {
        node.innerHTML = html;
        node.multiple = false;
        node.size = 1;
        node.value = "";
        node.setAttribute("aria-label", placeholder);
        node.setAttribute("title", `Choose one option: ${placeholder}`);
    });
}

function cropMatchesRegion(crop, region) {
    if (!region) {
        return true;
    }

    const targetRegion = region.toLowerCase().trim();

    if (!Array.isArray(crop.regions) || !crop.regions.length) {
        return true;
    }

    return crop.regions.some((r) => r.toLowerCase().trim() === targetRegion);
}

function cropMatchesCounty(crop, countyId) {
    if (!countyId) {
        return true;
    }

    const county = getCountyById(countyId);
    if (!county) {
        return true;
    }

    const rainfallMatches = {
        low: ["low", "low-medium"],
        "low-medium": ["low", "low-medium", "medium"],
        medium: ["low-medium", "medium", "medium-high"],
        "medium-high": ["medium", "medium-high", "high"],
        high: ["medium-high", "high"]
    };
    const temperatureMatches = {
        hot: ["warm"],
        warm: ["warm", "moderate"],
        mild: ["warm", "moderate"],
        cool: ["moderate"]
    };

    const allowedRainfall = rainfallMatches[county.rainfallBand] || [county.rainfallBand];
    const allowedTemperatures = temperatureMatches[county.temperatureBand] || ["warm", "moderate"];

    const rainfallOkay = !crop.rainfallNeed || allowedRainfall.includes(crop.rainfallNeed);
    const temperatureOkay = !crop.temperaturePreference || allowedTemperatures.includes(crop.temperaturePreference);

    return rainfallOkay && temperatureOkay;
}

function fillCropSelect(hiddenInput, items, placeholder, selectedCropId = "", recommendedIds = []) {
    const container = hiddenInput.closest(".custom-select-container");
    const trigger = container.querySelector(".custom-select-trigger span");
    const optionsMenu = container.querySelector(".custom-select-options");

    const sortedItems = [...items].sort((left, right) => {
        const aRec = recommendedIds.includes(left.id);
        const bRec = recommendedIds.includes(right.id);
        if (aRec && !bRec) return -1;
        if (!aRec && bRec) return 1;
        return left.name.localeCompare(right.name);
    });

    optionsMenu.innerHTML = sortedItems
        .map((item) => {
            const isRec = recommendedIds.includes(item.id);
            const label = isRec ? `⭐ ${item.name}` : item.name;
            return `<div class="custom-option ${isRec ? "is-recommended" : ""}" data-value="${item.id}">${label}</div>`;
        })
        .join("");

    const selectOption = (val, label) => {
        hiddenInput.value = val;
        trigger.textContent = label;
        optionsMenu.classList.add("is-hidden");
        updateRecommendationHint();
    };

    optionsMenu.querySelectorAll(".custom-option").forEach((opt) => {
        opt.onclick = () => selectOption(opt.dataset.value, opt.textContent);
    });

    // Setup trigger toggle
    container.querySelector(".custom-select-trigger").onclick = (e) => {
        e.stopPropagation();
        optionsMenu.classList.toggle("is-hidden");
    };

    // Close when clicking outside
    window.addEventListener("click", () => optionsMenu.classList.add("is-hidden"), { once: false });

    // Set initial state
    const current = sortedItems.find((i) => i.id === selectedCropId);
    trigger.textContent = current
        ? recommendedIds.includes(current.id)
            ? `⭐ ${current.name}`
            : current.name
        : placeholder;
    hiddenInput.value = selectedCropId || "";
}

function updatePlantingCropOptions(selectedCropId = "") {
    const region = el.plantingRegion?.value || "";
    // Fallback to farmer's registered county if the dropdown isn't set yet
    const countyId = el.plantingCounty?.value || state.farmer?.countyId || "";

    let cropsToShow = region ? state.crops.filter((crop) => cropMatchesRegion(crop, region)) : state.crops;

    if (region && cropsToShow.length === 0 && state.crops.length > 0) {
        cropsToShow = state.crops;
        debugLog("Crop filter fallback", `No crops found for '${region}'; showing all.`);
    }

    const recommendedIds = countyId
        ? state.crops.filter((crop) => cropMatchesCounty(crop, countyId)).map((c) => c.id)
        : [];

    const placeholder = "Select crop";

    if (el.plantingCrop) {
        fillCropSelect(el.plantingCrop, cropsToShow, placeholder, selectedCropId, recommendedIds);
    }

    if (region && countyId && !recommendedIds.length && cropsToShow.length > 0) {
        msg("No highly recommended crops match your specific county climate; showing general regional options.");
    }

    updateRecommendationHint();
    updateOverview();
}

/**
 * Updates the helper text explaining why a specific crop is recommended for the selected county.
 */
function updateRecommendationHint() {
    const cropId = el.plantingCrop.value;
    const countyId = el.plantingCounty.value;

    if (!cropId || !countyId || !el.cropRecommendationHint) {
        if (el.cropRecommendationHint) el.cropRecommendationHint.classList.add("is-hidden");
        return;
    }

    const crop = state.crops.find((c) => c.id === cropId);
    const county = getCountyById(countyId);

    if (!crop || !county || !cropMatchesCounty(crop, countyId)) {
        el.cropRecommendationHint.classList.add("is-hidden");
        return;
    }

    const rainfallDetail = county.avgAnnualRainfall ? `${county.avgAnnualRainfall}mm` : county.rainfallBand;
    const tempDetail = county.avgTemperature ? `${county.avgTemperature}°C` : county.temperatureBand;

    el.cropRecommendationHint.innerHTML = `<strong>Why is this recommended?</strong> ${crop.name} matches ${county.name}'s climate (Approx. ${rainfallDetail} rainfall & ${tempDetail} temp).`;
    el.cropRecommendationHint.classList.remove("is-hidden");
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = message ? "block" : "none";
    }
}

function clearErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll(".error-message").forEach((el) => {
            el.textContent = "";
            el.style.display = "none";
        });
    }
}

function buildPlaceholderOption(label) {
    return `<option value="" disabled selected>${label}</option>`;
}

function fillRegionSelects() {
    const html =
        buildPlaceholderOption("Select region") +
        state.regions.map((region) => `<option value="${region}">${region}</option>`).join("");

    el.regionSelects.forEach((node) => {
        node.innerHTML = html;
        node.multiple = false;
        node.size = 1;
        node.value = "";
    });
}

function fillCountySelect(node, counties, selectedCountyId = "") {
    const hasRegion = counties.length > 0;
    const placeholder = hasRegion ? "Select county" : "Select region first";
    const html =
        buildPlaceholderOption(placeholder) +
        counties
            .sort((left, right) => left.name.localeCompare(right.name))
            .map((item) => `<option value="${item.id}">${item.name}</option>`)
            .join("");

    node.innerHTML = html;
    node.disabled = !hasRegion;
    node.multiple = false;
    node.size = 1;
    node.value = selectedCountyId || "";
}

function getCountyById(countyId) {
    return state.counties.find((item) => item.id === countyId) || null;
}

function renderCountyPreview(previewNode, region, counties) {
    if (!previewNode) {
        return;
    }

    if (!region) {
        previewNode.textContent = "Select a region to see its counties.";
        return;
    }

    if (!counties.length) {
        previewNode.textContent = `No counties found for ${region}.`;
        return;
    }

    const countyNames = [...counties]
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((item) => item.name)
        .join(", ");
    previewNode.textContent = `${region}: ${countyNames}`;
}

function updateCountyOptions(regionSelect, countySelect, previewNode, selectedCountyId = "") {
    const region = regionSelect.value;
    const counties = region ? state.counties.filter((item) => item.region === region) : [];
    fillCountySelect(countySelect, counties, selectedCountyId);
    renderCountyPreview(previewNode, region, counties);
}

async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
    }
    return response.json();
}

async function loadLocalDatasets() {
    const [counties, crops, marketPrices] = await Promise.all([
        fetchJson("./data/counties.json"),
        fetchJson("./data/crops.json"),
        fetchJson("./data/market-prices.json")
    ]);

    return { counties, crops, marketPrices };
}

function loadEmbeddedDatasets() {
    return {
        counties: embeddedCounties,
        crops: embeddedCrops,
        marketPrices: []
    };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

/**
 * Finds the nearest county from the loaded dataset based on GPS coordinates.
 * This improves accuracy by mapping physical location to the correct data context.
 */
function findNearestCounty(lat, lon) {
    if (!state.counties.length) return null;

    let nearest = null;
    let minDistance = Infinity;

    state.counties.forEach((county) => {
        if (county.lat == null || county.lon == null) return;
        const dist = haversineDistance(lat, lon, county.lat, county.lon);
        if (dist < minDistance) {
            minDistance = dist;
            nearest = county;
        }
    });

    return nearest;
}

/**
 * Orchestrates automatic location detection. It updates the UI elements
 * based on the farmer's current GPS position.
 */
async function handleAutoLocation(regionEl, countyEl, previewEl) {
    if (!navigator.geolocation) {
        msg("GPS location services are not available in this browser.", true);
        return;
    }

    msg("Detecting your farm location using GPS...");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const nearest = findNearestCounty(latitude, longitude);

            if (nearest) {
                regionEl.value = nearest.region;
                updateCountyOptions(regionEl, countyEl, previewEl, nearest.id);

                // Ensure crops are filtered immediately if we updated the planting form
                if (countyEl === el.plantingCounty) {
                    updatePlantingCropOptions();
                }

                msg(`Location detected: ${nearest.name} County, ${nearest.region} Region.`);
                debugLog(
                    "GPS Match Success",
                    `${latitude.toFixed(4)}, ${longitude.toFixed(4)} mapped to ${nearest.id}`
                );
            } else {
                msg("Location detected, but no matching Kenyan county found in our records.", true);
            }
        },
        (err) => {
            const errorMsg = err.code === 1 ? "Permission denied." : err.message;
            msg(`Failed to detect location: ${errorMsg}`, true);
            debugLog("GPS Error", errorMsg);
        },
        { enableHighAccuracy: true, timeout: 15000 }
    );
}

function getCurrentCropId() {
    if (state.forecast?.crop?.id) {
        return state.forecast.crop.id;
    }

    if (state.plantings[0]?.cropId) {
        return state.plantings[0].cropId;
    }

    return document.querySelector("#plantingCrop")?.value || "";
}

function getCurrentCountyId() {
    if (state.forecast?.county?.id) {
        return state.forecast.county.id;
    }

    if (state.plantings[0]?.countyId) {
        return state.plantings[0].countyId;
    }

    if (el.plantingCounty?.value) {
        return el.plantingCounty.value;
    }

    return state.farmer?.countyId || "";
}

function getActiveMarketHistory() {
    const cropId = getCurrentCropId();
    const countyId = getCurrentCountyId();

    if (!cropId) {
        return { prices: [], cropId, countyId, usedFallbackCounty: false };
    }

    const countySpecificEntry = state.marketPrices.find(
        (entry) => entry.cropId === cropId && entry.countyId === countyId
    );
    const fallbackEntry = state.marketPrices.find((entry) => entry.cropId === cropId);
    const activeEntry = countySpecificEntry || fallbackEntry || null;

    return {
        prices: activeEntry?.prices || [],
        cropId,
        countyId: activeEntry?.countyId || countyId,
        usedFallbackCounty: Boolean(activeEntry && countyId && activeEntry.countyId !== countyId)
    };
}

function getBaselineMarketPrice(cropId) {
    const selectedCountyId = state.forecast?.county?.id || state.plantings[0]?.countyId || el.plantingCounty.value;
    const countyMarket = state.marketPrices.find(
        (entry) => entry.cropId === cropId && entry.countyId === selectedCountyId
    );
    const fallbackMarket = state.marketPrices.find((entry) => entry.cropId === cropId);
    const activeMarket = countyMarket || fallbackMarket;
    return activeMarket?.prices?.[activeMarket.prices.length - 1]?.averagePrice ?? null;
}

function renderNearbyMarkets() {
    const cropId = getCurrentCropId();

    if (!el.nearbyMarketsList) {
        return;
    }

    if (!state.userLocation) {
        el.nearbyMarketsList.innerHTML = `
      <article class="market-item empty">
        <strong>No nearby markets yet</strong>
        <p>Save a planting record, then use your location to compare nearby market prices.</p>
      </article>
    `;
        return;
    }

    if (!cropId) {
        el.nearbyMarketsList.innerHTML = `
      <article class="market-item empty">
        <strong>Select a crop first</strong>
        <p>Choose or save a crop so the app knows which nearby market prices to compare.</p>
      </article>
    `;
        return;
    }

    const nearbyEntries = state.marketPrices
        .filter((entry) => entry.cropId === cropId)
        .map((entry) => {
            const county = getCountyById(entry.countyId);
            const latestPrice = entry.prices?.[entry.prices.length - 1]?.averagePrice ?? null;

            if (!county || latestPrice === null || county.lat == null || county.lon == null) {
                return null;
            }

            return {
                county,
                latestPrice,
                distanceKm: haversineDistance(state.userLocation.lat, state.userLocation.lon, county.lat, county.lon)
            };
        })
        .filter(Boolean)
        .sort((left, right) => left.distanceKm - right.distanceKm)
        .slice(0, 4);

    if (!nearbyEntries.length) {
        el.nearbyMarketsList.innerHTML = `
      <article class="market-item empty">
        <strong>No market data for this crop</strong>
        <p>There is no nearby market-price dataset available yet for the selected crop.</p>
      </article>
    `;
        return;
    }

    const baselinePrice = getBaselineMarketPrice(cropId);

    el.nearbyMarketsList.innerHTML = nearbyEntries
        .map((entry) => {
            const delta = baselinePrice == null ? null : entry.latestPrice - baselinePrice;
            const deltaClass = delta == null ? "" : delta >= 0 ? "positive" : "negative";
            const deltaText =
                delta == null ? "No baseline price" : `${delta >= 0 ? "+" : "-"}${money(Math.abs(delta))}`;
            return `
      <article class="market-item">
        <strong>${entry.county.name} Market</strong>
        <p>${money(entry.latestPrice)} latest average price</p>
        <div class="market-meta">
          <span>${entry.distanceKm.toFixed(1)} km away</span>
          <span>${entry.county.region}</span>
          <span class="market-delta ${deltaClass}">${deltaText} vs your baseline</span>
        </div>
      </article>
    `;
        })
        .join("");
}

function requestNearbyMarkets() {
    if (!el.marketLocationStatus || !el.locateMarketsButton) {
        return;
    }

    if (!navigator.geolocation) {
        el.marketLocationStatus.textContent = "This browser does not support GPS location.";
        return;
    }

    el.marketLocationStatus.textContent = "Getting your current location...";
    el.locateMarketsButton.classList.add("loading");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            state.userLocation = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            el.marketLocationStatus.textContent = "Location found. Nearby markets are now sorted by distance.";
            el.locateMarketsButton.classList.remove("loading");
            renderNearbyMarkets();
        },
        () => {
            el.marketLocationStatus.textContent = "Location permission was denied or unavailable.";
            el.locateMarketsButton.classList.remove("loading");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
}

function showChartTooltip(content, event) {
    el.chartTooltip.innerHTML = content;
    el.chartTooltip.classList.remove("is-hidden");
    el.chartTooltip.style.left = `${event.clientX + 16}px`;
    el.chartTooltip.style.top = `${event.clientY - 14}px`;
}

function hideChartTooltip() {
    el.chartTooltip.classList.add("is-hidden");
}

function bindChartTooltip(svg, selector, getContent) {
    svg.querySelectorAll(selector).forEach((node) => {
        node.addEventListener("pointerenter", (event) => {
            showChartTooltip(getContent(node), event);
        });
        node.addEventListener("pointermove", (event) => {
            showChartTooltip(getContent(node), event);
        });
        node.addEventListener("pointerleave", hideChartTooltip);
    });
}

function drawAxes({ width, height, left, right, top, bottom, ticks, minValue, maxValue, labelFormatter }) {
    const chartHeight = height - top - bottom;
    return ticks
        .map((tick, index) => {
            const ratio = ticks.length === 1 ? 0 : index / (ticks.length - 1);
            const y = height - bottom - ratio * chartHeight;
            const value = minValue + (maxValue - minValue) * ratio;
            return `
      <line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="rgba(49, 92, 57, 0.12)" stroke-width="1"></line>
      <text x="${left - 10}" y="${y + 4}" text-anchor="end" fill="#6a7b67" font-size="12">${labelFormatter(value)}</text>
    `;
        })
        .join("");
}

function drawEmptyChart(svg, title, detail) {
    svg.innerHTML = `
    <rect x="0" y="0" width="720" height="280" rx="24" fill="rgba(255,255,255,0.45)"></rect>
    <text x="360" y="126" text-anchor="middle" fill="#315c39" font-size="20" font-weight="700">${title}</text>
    <text x="360" y="156" text-anchor="middle" fill="#6a7b67" font-size="14">${detail}</text>
  `;
}

function drawForecastChart(series) {
    const svg = el.priceChart;
    if (!series?.length) {
        drawEmptyChart(svg, "No forecast chart yet", "Save a planting record to see projected weekly prices.");
        return;
    }

    const width = 720;
    const height = 280;
    const left = 54;
    const right = 24;
    const top = 20;
    const bottom = 40;
    const maxPrice = Math.max(...series.map((point) => point.price));
    const minPrice = Math.min(...series.map((point) => point.price));
    const step = (width - left - right) / Math.max(series.length - 1, 1);
    const range = Math.max(maxPrice - minPrice, 1);
    const points = series.map((point, index) => {
        const x = left + index * step;
        const y = height - bottom - ((point.price - minPrice) / range) * (height - top - bottom);
        return { ...point, x, y };
    });
    const last = points[points.length - 1];
    const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    const area = `${path} L ${last.x} ${height - bottom} L ${points[0].x} ${height - bottom} Z`;
    const peak = points.reduce((best, point) => (point.price > best.price ? point : best), points[0]);
    const axisLabels = drawAxes({
        width,
        height,
        left,
        right,
        top,
        bottom,
        ticks: [0, 1, 2, 3],
        minValue: minPrice,
        maxValue: maxPrice,
        labelFormatter: (value) => Math.round(value).toLocaleString("en-KE")
    });

    svg.innerHTML = `
    <defs>
      <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(49, 92, 57, 0.34)"></stop>
        <stop offset="100%" stop-color="rgba(49, 92, 57, 0.02)"></stop>
      </linearGradient>
    </defs>
    ${axisLabels}
    <path class="chart-area" d="${area}" fill="url(#chartFill)"></path>
    <path class="chart-line" d="${path}" fill="none" stroke="#315c39" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
    ${points
        .map(
            (point) => `
      <circle
        class="chart-node"
        cx="${point.x}"
        cy="${point.y}"
        r="4.5"
        fill="#315c39"
        data-label="${point.label}"
        data-price="${point.price}"
      ></circle>
    `
        )
        .join("")}
    <circle cx="${peak.x}" cy="${peak.y}" r="8" fill="#e08a2e" stroke="#fff8ef" stroke-width="3"></circle>
    ${points.map((point) => `<text x="${point.x}" y="${height - 14}" text-anchor="middle" fill="#6a7b67" font-size="12">${point.label}</text>`).join("")}
  `;

    bindChartTooltip(
        svg,
        ".chart-node",
        (node) => `
    <strong>${node.dataset.label}</strong>
    <span>${money(Number(node.dataset.price))} per unit</span>
  `
    );
}

function drawHistoryChart(history) {
    const svg = el.historyChart;
    if (!history?.length) {
        drawEmptyChart(
            svg,
            "No market history yet",
            "Historical county prices will appear once a forecast is available."
        );
        return;
    }

    const width = 720;
    const height = 280;
    const left = 54;
    const right = 24;
    const top = 20;
    const bottom = 40;
    const values = history.map((point) => point.averagePrice);
    const maxPrice = Math.max(...values);
    const minPrice = Math.min(...values);
    const range = Math.max(maxPrice - minPrice, 1);
    const barAreaWidth = width - left - right;
    const barWidth = Math.min(60, barAreaWidth / history.length - 10);
    const gap = history.length === 1 ? 0 : (barAreaWidth - barWidth * history.length) / (history.length - 1);
    const axisLabels = drawAxes({
        width,
        height,
        left,
        right,
        top,
        bottom,
        ticks: [0, 1, 2, 3],
        minValue: minPrice,
        maxValue: maxPrice,
        labelFormatter: (value) => Math.round(value).toLocaleString("en-KE")
    });

    const bars = history
        .map((point, index) => {
            const x = left + index * (barWidth + gap);
            const barHeight = ((point.averagePrice - minPrice) / range) * (height - top - bottom);
            const y = height - bottom - barHeight;
            const monthDate = new Date(`${point.month}-01T00:00:00`);
            const monthLabel = Number.isNaN(monthDate.getTime())
                ? point.month
                : new Intl.DateTimeFormat("en-KE", { month: "short" }).format(monthDate);
            return `
      <rect
        class="history-bar"
        x="${x}"
        y="${y}"
        width="${barWidth}"
        height="${Math.max(barHeight, 6)}"
        rx="12"
        fill="rgba(224, 138, 46, 0.78)"
        data-label="${point.month}"
        data-price="${point.averagePrice}"
      ></rect>
      <text x="${x + barWidth / 2}" y="${height - 14}" text-anchor="middle" fill="#6a7b67" font-size="12">${monthLabel}</text>
    `;
        })
        .join("");

    svg.innerHTML = `
    ${axisLabels}
    ${bars}
  `;

    bindChartTooltip(
        svg,
        ".history-bar",
        (node) => `
    <strong>${node.dataset.label}</strong>
    <span>${money(Number(node.dataset.price))} average market price</span>
  `
    );
}

function summarizeHistoryTrend(history) {
    if (!history?.length) {
        return {
            value: "-",
            text: "Recent county price movement will appear after a forecast is generated."
        };
    }

    const first = history[0].averagePrice;
    const last = history[history.length - 1].averagePrice;
    const change = last - first;
    const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
    const percent = first ? Math.round((Math.abs(change) / first) * 100) : 0;
    const value = `${direction === "flat" ? "0" : `${direction === "up" ? "+" : "-"}${percent}%`}`;
    const text =
        direction === "flat"
            ? "County prices have stayed mostly stable across the recent market months."
            : `County prices are ${direction} by about ${percent}% across the recent recorded months.`;

    return { value, text };
}

/**
 * Visualizes how well the selected crop's needs match the county's climate.
 */
function drawClimateComparisonChart(crop, county) {
    const svg = el.climateChart;
    if (!svg) return;

    const rMap = { low: 1, "low-medium": 2, medium: 3, "medium-high": 4, high: 5 };
    const tMap = { cool: 1, mild: 2, warm: 3, hot: 4 };

    const iRain = rMap[crop.rainfallNeed] || 0;
    const aRain = rMap[county.rainfallBand] || 0;
    const iTemp = tMap[crop.temperaturePreference] || 0;
    const aTemp = tMap[county.temperatureBand] || 0;

    const w = 400;
    const rX = (val) => (val / 5) * w;
    const tX = (val) => (val / 4) * w;

    const rainMatchPct = iRain && aRain ? Math.round(Math.max(0, 100 - (Math.abs(iRain - aRain) / 4) * 100)) : 0;
    const tempMatchPct = iTemp && aTemp ? Math.round(Math.max(0, 100 - (Math.abs(iTemp - aTemp) / 3) * 100)) : 0;

    const getMatchColor = (pct) => (pct > 80 ? "var(--primary)" : pct >= 50 ? "var(--accent)" : "var(--danger)");
    const rainColor = getMatchColor(rainMatchPct);
    const tempColor = getMatchColor(tempMatchPct);

    const rainfallLabels = [
        { i: 0.5, l: "Low" },
        { i: 1.5, l: "Low-Med" },
        { i: 2.5, l: "Med" },
        { i: 3.5, l: "Med-High" },
        { i: 4.5, l: "High" }
    ]
        .map((p) => `<text x="${rX(p.i)}" y="44" font-size="8" fill="var(--muted)" text-anchor="middle">${p.l}</text>`)
        .join("");
    const rainfallTicks = [1, 2, 3, 4]
        .map(
            (t) =>
                `<line x1="${rX(t)}" y1="22" x2="${rX(t)}" y2="32" stroke="rgba(255,255,255,0.4)" stroke-width="1"></line>`
        )
        .join("");

    const tempLabels = [
        { i: 0.5, l: "Cool" },
        { i: 1.5, l: "Mild" },
        { i: 2.5, l: "Warm" },
        { i: 3.5, l: "Hot" }
    ]
        .map((p) => `<text x="${tX(p.i)}" y="94" font-size="8" fill="var(--muted)" text-anchor="middle">${p.l}</text>`)
        .join("");
    const tempTicks = [1, 2, 3]
        .map(
            (t) =>
                `<line x1="${tX(t)}" y1="72" x2="${tX(t)}" y2="82" stroke="rgba(255,255,255,0.4)" stroke-width="1"></line>`
        )
        .join("");

    const rainInfo = `<strong>${crop.name} Needs:</strong> ${crop.rainfallNeed || "General"} rainfall<br><strong>${county.name}:</strong> ${county.rainfallBand} profile`;
    const tempInfo = `<strong>${crop.name} Prefers:</strong> ${crop.temperaturePreference || "General"} temp<br><strong>${county.name}:</strong> ${county.temperatureBand} climate`;

    svg.innerHTML = `
    <text x="0" y="12" font-size="10" font-weight="600" fill="var(--muted)">RAINFALL MATCH</text>
    <text x="${w}" y="12" font-size="10" font-weight="700" fill="${rainColor}" text-anchor="end">${rainMatchPct}% Match</text>
    <rect class="climate-node" x="0" y="22" width="${w}" height="10" rx="5" fill="var(--line)" data-info="${rainInfo}"></rect>
    <rect class="climate-node" x="0" y="22" width="${rX(iRain)}" height="10" rx="5" fill="var(--primary)" opacity="0.6" data-info="${rainInfo}"></rect>
    ${rainfallTicks}
    <rect class="climate-node" x="${Math.max(0, rX(aRain) - 2)}" y="20" width="4" height="14" rx="2" fill="var(--accent)" data-info="${rainInfo}"></rect>
    ${rainfallLabels}

    <text x="0" y="62" font-size="10" font-weight="600" fill="var(--muted)">TEMPERATURE MATCH</text>
    <text x="${w}" y="62" font-size="10" font-weight="700" fill="${tempColor}" text-anchor="end">${tempMatchPct}% Match</text>
    <rect class="climate-node" x="0" y="72" width="${w}" height="10" rx="5" fill="var(--line)" data-info="${tempInfo}"></rect>
    <rect class="climate-node" x="0" y="72" width="${tX(iTemp)}" height="10" rx="5" fill="var(--primary)" opacity="0.6" data-info="${tempInfo}"></rect>
    ${tempTicks}
    <rect class="climate-node" x="${Math.max(0, tX(aTemp) - 2)}" y="70" width="4" height="14" rx="2" fill="var(--accent)" data-info="${tempInfo}"></rect>
    ${tempLabels}

    <g transform="translate(0, 115)" font-size="10" fill="var(--muted)">
      <rect width="8" height="8" rx="2" fill="var(--primary)" opacity="0.6"></rect>
      <text x="12" y="8">Crop Ideal</text>
      <rect x="80" width="8" height="8" rx="2" fill="var(--accent)"></rect>
      <text x="92" y="8">County Actual</text>
    </g>
  `;

    bindChartTooltip(svg, ".climate-node", (node) => node.dataset.info);
}

function renderProfile() {
    if (!state.farmer) {
        updateSignedInView();
        el.authStatus.textContent = t("notSignedIn");
        el.profileForm.reset();
        el.farmerRegion.value = "";
        fillCountySelect(el.farmerCounty, []);
        renderCountyPreview(el.farmerCountyPreview, "", []);
        updateOverview();
        return;
    }
    updateSignedInView();
    el.authStatus.textContent = t("welcomeBack", { name: state.farmer.name });
    el.farmerName.value = state.farmer.name || "";
    el.farmerEmail.value = state.farmer.email || "";
    el.farmerPhone.value = state.farmer.phoneNumber || "";
    const farmerCounty = getCountyById(state.farmer.countyId);
    el.farmerRegion.value = farmerCounty?.region || "";
    updateCountyOptions(el.farmerRegion, el.farmerCounty, el.farmerCountyPreview, state.farmer.countyId || "");
    updateOverview();
}

function renderPlantings() {
    if (!state.plantings.length) {
        el.plantingRows.innerHTML = `<tr><td colspan="6">${t("noPlantingRecordsRow")}</td></tr>`;
        el.latestRecord.textContent = t("noPlantingRecordSaved");
        updateOverview();
        renderNearbyMarkets();
        return;
    }
    el.plantingRows.innerHTML = state.plantings
        .map((item) => {
            const crop = state.crops.find((entry) => entry.id === item.cropId)?.name || item.cropId;
            const county = state.counties.find((entry) => entry.id === item.countyId)?.name || item.countyId;
            return `<tr>
      <td>${crop}</td>
      <td>${county}</td>
      <td>${prettyDate(item.plantingDate)}</td>
      <td>${item.farmSizeAcres} ${t("acresLabel")}</td>
      <td>${item.notes || "-"}</td>
      <td class="table-actions-cell">
        <button type="button" class="table-action" data-edit-planting="${item.id}">${t("editButton")}</button>
        <button type="button" class="table-action danger-action" data-delete-planting="${item.id}">${t("deleteButton")}</button>
      </td>
    </tr>`;
        })
        .join("");
    const latest = state.plantings[0];
    const crop = state.crops.find((entry) => entry.id === latest.cropId)?.name || latest.cropId;
    const county = state.counties.find((entry) => entry.id === latest.countyId)?.name || latest.countyId;
    el.latestRecord.textContent = t("latestRecordTemplate", {
        crop,
        county,
        date: prettyDate(latest.plantingDate)
    });
    updateOverview();
    renderNearbyMarkets();
}

function resetPlantingForm() {
    state.editingPlantingId = null;
    el.plantingForm.reset();

    if (state.farmer && state.farmer.countyId) {
        const county = getCountyById(state.farmer.countyId);
        if (county) {
            el.plantingRegion.value = county.region;
            updateCountyOptions(el.plantingRegion, el.plantingCounty, el.plantingCountyPreview, county.id);
        }
    } else {
        el.plantingRegion.value = "";
        fillCountySelect(el.plantingCounty, []);
        renderCountyPreview(el.plantingCountyPreview, "", []);
    }

    updatePlantingCropOptions();
    document.querySelector("#plantingDate").value = defaultPlantingDate();
    el.plantingSubmitButton.textContent = t("savePlantingAndForecast");
    el.cancelEditButton.classList.add("is-hidden");
}

function startEditPlanting(plantingId) {
    const planting = state.plantings.find((item) => item.id === plantingId);
    if (!planting) {
        msg(t("plantingRecordNotFound"), true);
        return;
    }

    state.editingPlantingId = planting.id;
    const plantingCounty = getCountyById(planting.countyId);
    el.plantingRegion.value = plantingCounty?.region || "";
    updatePlantingCropOptions(planting.cropId);
    updateCountyOptions(el.plantingRegion, el.plantingCounty, el.plantingCountyPreview, planting.countyId);
    document.querySelector("#plantingDate").value = planting.plantingDate;
    document.querySelector("#farmSize").value = planting.farmSizeAcres;
    const plantingNotesField = document.querySelector("#plantingNotes");
    if (plantingNotesField) {
        plantingNotesField.value = planting.notes || "";
    }
    el.plantingSubmitButton.textContent = t("updatePlantingRecord");
    el.cancelEditButton.classList.remove("is-hidden");
    msg(t("editingPlantingRecord"));
}

function renderForecast() {
    if (!state.forecast) {
        const marketTrend = getActiveMarketHistory();
        const trendSummary = summarizeHistoryTrend(marketTrend.prices);
        const cropName = state.crops.find((entry) => entry.id === marketTrend.cropId)?.name || "selected crop";
        const countyName = getCountyById(marketTrend.countyId)?.name || "selected county";

        el.harvestWindow.textContent = t("noForecastYet");
        el.sellWindow.textContent = "-";
        el.recommendation.textContent = t("forecastPrompt");
        el.yield.textContent = "-";
        el.revenue.textContent = "-";
        el.weatherScore.textContent = "--";
        el.weatherNarrative.textContent = t("weatherPending");
        el.smsPreview.textContent = t("smsPending");
        el.heroHarvest.textContent = t("waiting");
        el.heroPrice.textContent = "KES 0";
        el.heroRisk.textContent = t("unknown");
        el.heroSms.textContent = api.token ? t("ready") : t("signInShort");
        el.weatherPills.innerHTML = "";
        el.historyTrendValue.textContent = trendSummary.value;
        el.historyTrendText.textContent = marketTrend.prices.length
            ? `${trendSummary.text} Showing ${cropName} prices for ${countyName}${marketTrend.usedFallbackCounty ? t("closestCountySuffix") : "."}`
            : t("recentTrendPending");
        el.forecastPeakValue.textContent = "-";
        el.forecastPeakText.textContent = t("projectedAdvicePending");
        drawForecastChart([]);
        drawHistoryChart(marketTrend.prices);
        if (el.climateChart) el.climateChart.innerHTML = "";
        return;
    }

    const forecast = state.forecast;
    const priceSeries = Array.isArray(forecast.priceSeries) ? forecast.priceSeries : [];
    const marketHistory = Array.isArray(forecast.marketHistory) ? forecast.marketHistory : [];
    const harvestStart = prettyDate(forecast.harvestWindow.start);
    const harvestEnd = prettyDate(forecast.harvestWindow.end);
    const bestWeek =
        forecast.bestSellWeek > 0 ? t("weekAfterHarvest", { week: forecast.bestSellWeek }) : t("harvestWeek");
    el.harvestWindow.textContent = `${harvestStart} - ${harvestEnd}`;
    el.sellWindow.textContent = bestWeek;
    el.recommendation.textContent = forecast.recommendation;
    el.yield.textContent = `${forecast.estimatedYield} ${forecast.unit}`;
    el.revenue.textContent = money(forecast.expectedRevenue);
    el.weatherScore.textContent = `${forecast.readinessScore}%`;
    el.weatherNarrative.textContent = forecast.weatherNarrative;
    el.smsPreview.textContent = t("smsPreviewTemplate", {
        name: state.farmer?.name || "Farmer",
        crop: forecast.crop.name,
        harvestStart,
        harvestEnd,
        bestWeek
    });
    el.heroHarvest.textContent = t("heroHarvestDays", { days: forecast.maturityDays });
    el.heroPrice.textContent = priceSeries.length
        ? money(Math.max(...priceSeries.map((point) => point.price)))
        : "KES 0";
    el.heroRisk.textContent = forecast.riskLabel;
    el.heroSms.textContent = state.farmer?.phoneNumber ? t("ready") : t("addPhone");
    document.documentElement.style.setProperty("--meter-angle", `${forecast.readinessScore}%`);
    el.weatherPills.innerHTML = [
        t("weatherPillCounty", { county: forecast.county.name }),
        t("weatherPillCrop", { crop: forecast.crop.name }),
        t("weatherPillRisk", { risk: forecast.riskLabel })
    ]
        .map((item) => `<span>${item}</span>`)
        .join("");
    const historySummary = summarizeHistoryTrend(marketHistory);
    const peakPoint = priceSeries.length
        ? priceSeries.reduce((best, point) => (point.price > best.price ? point : best), priceSeries[0])
        : null;
    el.historyTrendValue.textContent = historySummary.value;
    el.historyTrendText.textContent = historySummary.text;
    el.forecastPeakValue.textContent = peakPoint ? money(peakPoint.price) : "-";
    el.forecastPeakText.textContent = peakPoint
        ? t("bestProjectedPoint", { label: peakPoint.label, price: money(peakPoint.price) })
        : t("projectedAdvicePending");
    drawForecastChart(priceSeries);
    drawHistoryChart(marketHistory);
    drawClimateComparisonChart(forecast.crop, forecast.county);
    renderNearbyMarkets();
}

function defaultPlantingDate() {
    const date = new Date();
    date.setDate(date.getDate() - 21);
    return date.toISOString().slice(0, 10);
}

async function handleAuthSuccess(payload, successMessage) {
    api.token = payload.token;
    localStorage.setItem(tokenKey, api.token);
    persistFarmer(payload.farmer || null);
    updateSignedInView();
    el.authStatus.textContent = state.farmer ? t("welcomeBack", { name: state.farmer.name }) : t("signedIn");
    renderProfile();
    renderPlantings();
    renderForecast();
    el.registerForm.reset();
    el.loginForm.reset();
    el.registerRegion.value = "";
    fillCountySelect(el.registerCounty, []);
    renderCountyPreview(el.registerCountyPreview, "", []);
    msg(successMessage);
    debugLog("Auth success", successMessage);
    window.location.hash = "planner";
    document.querySelector("#planner")?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
        await loadDashboard();
    } catch {
        renderProfile();
        renderPlantings();
        renderForecast();
        msg(`${successMessage} Basic profile view is ready, but dashboard data could not load yet.`, true);
        debugLog("Dashboard follow-up failed", "User is signed in but dashboard data could not load.");
    }
}

async function loadDatasets() {
    let payload;
    let source = "API";
    setFormsLoading(true);

    try {
        payload = await api.request("/api/datasets");
        debugLog("Datasets loaded", "Source: API");
    } catch {
        try {
            payload = await loadLocalDatasets();
            source = "Local files";
            msg("Running in local file mode. Region, county, and crop lists were loaded from local data files.");
            debugLog("Datasets loaded", "Source: local files");
        } catch {
            payload = loadEmbeddedDatasets();
            source = "Built-in fallback";
            msg("Using built-in fallback lists so the selectors stay visible during development.");
            debugLog("Datasets loaded", "Source: built-in fallback");
        }
    }

    state.counties = payload.counties;
    state.regions = [...new Set(state.counties.map((item) => item.region))].sort((left, right) =>
        left.localeCompare(right)
    );
    state.crops = payload.crops;
    state.marketPrices = payload.marketPrices || [];
    fillSelects(state.crops, el.cropSelects, "Select crop");
    fillRegionSelects();
    updatePlantingCropOptions();
    el.countySelects.forEach((node) => fillCountySelect(node, []));
    renderCountyPreview(el.registerCountyPreview, "", []);
    renderCountyPreview(el.farmerCountyPreview, "", []);
    renderCountyPreview(el.plantingCountyPreview, "", []);
    setDatasetStatus({
        text: t("datasetsReady"),
        source,
        regionCount: state.regions.length,
        countyCount: state.counties.length,
        cropCount: state.crops.length
    });

    // This ensures the planting form shows all crops initially with correct formatting
    updatePlantingCropOptions();
    setFormsLoading(false);
}

async function loadDashboard() {
    if (!api.token) {
        persistFarmer(null);
        state.plantings = [];
        state.forecast = null;
        renderProfile();
        renderPlantings();
        renderForecast();
        return;
    }

    const [profile, plantings, dashboard] = await Promise.all([
        api.request("/api/me/profile"),
        api.request("/api/me/plantings"),
        api.request("/api/me/dashboard")
    ]);
    persistFarmer(profile.farmer);
    state.plantings = plantings.plantings;
    state.forecast = dashboard.forecast;
    renderProfile();
    renderPlantings();
    renderForecast();
    resetPlantingForm();
}

el.registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors("registerForm");
    const name = document.querySelector("#registerName").value;
    const email = document.querySelector("#registerEmail").value;
    const phone = document.querySelector("#registerPhone").value;
    const password = document.querySelector("#registerPassword").value;
    const county = document.querySelector("#registerCounty").value;

    let hasError = false;

    if (!isValidName(name)) {
        showError("register-name-error", `Name must be at least ${MIN_NAME_LENGTH} characters.`);
        hasError = true;
    }
    if (!isValidEmail(email)) {
        showError("register-email-error", "Please enter a valid email address.");
        hasError = true;
    }
    if (phone && !isValidPhoneNumber(phone)) {
        showError("register-phone-error", "Please enter a valid phone number.");
        hasError = true;
    }
    if (!isValidPassword(password)) {
        showError("register-password-error", `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
        hasError = true;
    }
    if (!county) {
        showError("register-county-error", "Please select a county.");
        hasError = true;
    }

    if (hasError) return;

    const button = el.registerForm.querySelector("button");
    button.classList.add("loading");
    button.disabled = true;
    try {
        const payload = await api.request("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password,
                phoneNumber: phone,
                countyId: county
            })
        });
        await handleAuthSuccess(payload, "Account created. You are now signed in.");
    } catch (error) {
        msg(error.message, true);
        debugLog("Register failed", error.message);
    } finally {
        button.classList.remove("loading");
        button.disabled = false;
    }
});

el.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors("loginForm");
    const email = document.querySelector("#loginEmail").value;
    const password = document.querySelector("#loginPassword").value;

    let hasError = false;

    if (!isValidEmail(email)) {
        showError("login-email-error", "Please enter a valid email address.");
        hasError = true;
    }
    if (!password) {
        showError("login-password-error", "Password is required.");
        hasError = true;
    }

    if (hasError) return;

    const button = el.loginForm.querySelector("button");
    button.classList.add("loading");
    button.disabled = true;
    try {
        const payload = await api.request("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        });
        await handleAuthSuccess(payload, "Signed in successfully.");
    } catch (error) {
        msg(error.message, true);
        debugLog("Login failed", error.message);
    } finally {
        button.classList.remove("loading");
        button.disabled = false;
    }
});

el.registerRegion.addEventListener("change", () => {
    updateCountyOptions(el.registerRegion, el.registerCounty, el.registerCountyPreview);
});

el.farmerRegion.addEventListener("change", () => {
    updateCountyOptions(el.farmerRegion, el.farmerCounty, el.farmerCountyPreview);
    msg("Choose a county for the selected profile region, then save the profile.");
});

el.plantingRegion.addEventListener("change", () => {
    updateCountyOptions(el.plantingRegion, el.plantingCounty, el.plantingCountyPreview);
    updatePlantingCropOptions();
});

el.plantingCounty.addEventListener("change", () => {
    updatePlantingCropOptions();
});

el.plantingCrop.addEventListener("change", () => {
    updateRecommendationHint();
});

el.clearPlantingFilters?.addEventListener("click", () => {
    el.plantingRegion.value = "";
    updateCountyOptions(el.plantingRegion, el.plantingCounty, el.plantingCountyPreview);
    updatePlantingCropOptions();
    msg("Location filters cleared. Showing all available crops.");
});

el.reloadDatasetsButton.addEventListener("click", () => {
    setDatasetStatus({
        text: "Reloading region and county lists...",
        source: "Loading",
        regionCount: state.regions.length,
        countyCount: state.counties.length,
        cropCount: state.crops.length
    });

    loadDatasets().catch(() => {
        setDatasetStatus({
            text: "Reload failed. The built-in fallback should still keep selectors visible.",
            source: "Error",
            regionCount: state.regions.length,
            countyCount: state.counties.length,
            cropCount: state.crops.length,
            isError: true
        });
    });
});

el.logoutButton.addEventListener("click", () => {
    api.token = "";
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(farmerKey);
    updateSignedInView();
    msg("Signed out.");
    debugLog("Signed out");
    loadDashboard();
});

el.profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors("profileForm");
    const name = el.farmerName.value;
    const phone = el.farmerPhone.value;
    const county = el.farmerCounty.value;

    let hasError = false;

    if (name && !isValidName(name)) {
        showError("profile-name-error", `Name must be at least ${MIN_NAME_LENGTH} characters.`);
        hasError = true;
    }
    if (phone && !isValidPhoneNumber(phone)) {
        showError("profile-phone-error", "Please enter a valid phone number.");
        hasError = true;
    }
    if (!county) {
        msg("Choose a county in the profile section before saving.", true);
        hasError = true;
    }

    if (hasError) return;

    const button = el.profileForm.querySelector("button");
    button.classList.add("loading");
    button.disabled = true;
    try {
        const payload = await api.request("/api/me/profile", {
            method: "PUT",
            body: JSON.stringify({
                name,
                phoneNumber: phone,
                countyId: county
            })
        });

        persistFarmer(payload.farmer);
        renderProfile();
        msg("Profile updated successfully.");
        debugLog("Profile updated");
    } catch (error) {
        msg(error.message, true);
        debugLog("Profile update failed", error.message);
    } finally {
        button.classList.remove("loading");
        button.disabled = false;
    }
});

el.plantingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors("plantingForm");
    const crop = document.querySelector("#plantingCrop").value;
    const region = document.querySelector("#plantingRegion").value;
    const county = document.querySelector("#plantingCounty").value;
    const date = document.querySelector("#plantingDate").value;
    const size = document.querySelector("#farmSize").value;

    let hasError = false;

    if (!crop) {
        // For now, assume browser handles required
    }
    if (!region) {
        // similar
    }
    if (!county) {
        // similar
    }
    if (!isValidPlantingDate(date)) {
        showError("planting-date-error", "Planting date cannot be in the future.");
        hasError = true;
    }
    if (!isValidFarmSize(size)) {
        showError(
            "farm-size-error",
            `Farm size must be between ${MIN_FARM_SIZE_ACRES} and ${MAX_FARM_SIZE_ACRES} acres.`
        );
        hasError = true;
    }

    if (hasError) return;

    el.plantingSubmitButton.classList.add("loading");
    el.plantingSubmitButton.disabled = true;
    try {
        const path = state.editingPlantingId ? `/api/me/plantings/${state.editingPlantingId}` : "/api/me/plantings";
        const method = state.editingPlantingId ? "PUT" : "POST";

        await api.request(path, {
            method,
            body: JSON.stringify({
                cropId: crop,
                countyId: county,
                plantingDate: date,
                farmSizeAcres: size,
                notes: getPlantingNotesValue()
            })
        });
        msg(state.editingPlantingId ? "Planting record updated." : "Planting record saved.");
        debugLog(state.editingPlantingId ? "Planting updated" : "Planting saved");
        resetPlantingForm();
        await loadDashboard();
        scrollToInsights();
    } catch (error) {
        msg(error.message, true);
        debugLog("Planting save failed", error.message);
    } finally {
        el.plantingSubmitButton.classList.remove("loading");
        el.plantingSubmitButton.disabled = false;
    }
});

el.plantingRows.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-planting]");
    if (editButton) {
        startEditPlanting(editButton.dataset.editPlanting);
        return;
    }

    const button = event.target.closest("[data-delete-planting]");
    if (!button) {
        return;
    }

    const plantingId = button.dataset.deletePlanting;
    const confirmed = window.confirm("Delete this planting record?");
    if (!confirmed) {
        return;
    }

    try {
        await api.request(`/api/me/plantings/${plantingId}`, {
            method: "DELETE"
        });
        msg("Planting record deleted.");
        if (state.editingPlantingId === plantingId) {
            resetPlantingForm();
        }
        await loadDashboard();
    } catch (error) {
        msg(error.message, true);
    }
});

el.cancelEditButton.addEventListener("click", () => {
    resetPlantingForm();
    msg("Edit cancelled.");
});

el.smsButton.addEventListener("click", async () => {
    if (!state.plantings.length) {
        msg("Save a planting record first.", true);
        return;
    }

    el.smsButton.classList.add("loading");
    el.smsButton.disabled = true;
    try {
        const payload = await api.request("/api/alerts/sms", {
            method: "POST",
            body: JSON.stringify({ plantingId: state.plantings[0].id })
        });
        msg(payload.result.delivered ? "SMS alert sent successfully." : `SMS saved in ${payload.result.mode} mode.`);
    } catch (error) {
        msg(error.message, true);
    } finally {
        el.smsButton.classList.remove("loading");
        el.smsButton.disabled = false;
    }
});

if (el.locateMarketsButton) {
    el.locateMarketsButton.addEventListener("click", () => {
        requestNearbyMarkets();
    });
}

/**
 * Initializes an interactive Leaflet map to allow location selection via click.
 */
function initFarmMap() {
    const mapElement = document.querySelector("#farmMap");
    if (!mapElement) return;

    // Centered on Kenya
    const map = L.map("farmMap").setView([0.0236, 37.9062], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const marker = L.marker([0.0236, 37.9062], { draggable: false }).addTo(map);

    map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);

        const nearest = findNearestCounty(lat, lng);
        if (nearest) {
            el.plantingRegion.value = nearest.region;
            updateCountyOptions(el.plantingRegion, el.plantingCounty, el.plantingCountyPreview, nearest.id);
            updatePlantingCropOptions();
            msg(`Map selection: ${nearest.name} County.`);
        }
    });

    return map;
}

// Event listeners for "Detect Location" buttons.
// These assume buttons with the following IDs are added to your HTML templates.
document.querySelector("#detectLocationRegister")?.addEventListener("click", () => {
    handleAutoLocation(el.registerRegion, el.registerCounty, el.registerCountyPreview);
});

document.querySelector("#detectLocationProfile")?.addEventListener("click", () => {
    handleAutoLocation(el.farmerRegion, el.farmerCounty, el.farmerCountyPreview);
});

document.querySelector("#detectLocationPlanting")?.addEventListener("click", () => {
    // Note: planting form uses plantingRegion and plantingCounty elements
    handleAutoLocation(el.plantingRegion, el.plantingCounty, el.plantingCountyPreview);
});

el.localeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.dataset.setLocale && button.dataset.setLocale !== state.locale) {
            setLocale(button.dataset.setLocale);
        }
    });
});

resetPlantingForm();
setDatasetStatus({
    text: t("datasetsLoading"),
    source: t("datasetSourceLoading"),
    regionCount: 0,
    countyCount: 0,
    cropCount: 0
});

// Real-time validation on blur
document.querySelector("#registerName").addEventListener("blur", (e) => {
    if (e.target.value && !isValidName(e.target.value)) {
        showError("register-name-error", `Name must be at least ${MIN_NAME_LENGTH} characters.`);
    } else {
        showError("register-name-error", "");
    }
});

document.querySelector("#registerEmail").addEventListener("blur", (e) => {
    if (e.target.value && !isValidEmail(e.target.value)) {
        showError("register-email-error", "Please enter a valid email address.");
    } else {
        showError("register-email-error", "");
    }
});

document.querySelector("#registerPhone").addEventListener("blur", (e) => {
    if (e.target.value && !isValidPhoneNumber(e.target.value)) {
        showError("register-phone-error", "Please enter a valid phone number.");
    } else {
        showError("register-phone-error", "");
    }
});

document.querySelector("#registerPassword").addEventListener("blur", (e) => {
    if (e.target.value && !isValidPassword(e.target.value)) {
        showError("register-password-error", `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    } else {
        showError("register-password-error", "");
    }
});

document.querySelector("#loginEmail").addEventListener("blur", (e) => {
    if (e.target.value && !isValidEmail(e.target.value)) {
        showError("login-email-error", "Please enter a valid email address.");
    } else {
        showError("login-email-error", "");
    }
});

document.querySelector("#farmerName").addEventListener("blur", (e) => {
    if (e.target.value && !isValidName(e.target.value)) {
        showError("profile-name-error", `Name must be at least ${MIN_NAME_LENGTH} characters.`);
    } else {
        showError("profile-name-error", "");
    }
});

document.querySelector("#farmerPhone").addEventListener("blur", (e) => {
    if (e.target.value && !isValidPhoneNumber(e.target.value)) {
        showError("profile-phone-error", "Please enter a valid phone number.");
    } else {
        showError("profile-phone-error", "");
    }
});

document.querySelector("#plantingDate").addEventListener("blur", (e) => {
    if (e.target.value && !isValidPlantingDate(e.target.value)) {
        showError("planting-date-error", "Planting date cannot be in the future.");
    } else {
        showError("planting-date-error", "");
    }
});

document.querySelector("#farmSize").addEventListener("blur", (e) => {
    if (e.target.value && !isValidFarmSize(e.target.value)) {
        showError(
            "farm-size-error",
            `Farm size must be between ${MIN_FARM_SIZE_ACRES} and ${MAX_FARM_SIZE_ACRES} acres.`
        );
    } else {
        showError("farm-size-error", "");
    }
});

loadDatasets()
    .then(loadDashboard)
    .then(initFarmMap)
    .catch(() => {
        msg(
            "County and crop data could not load. Start the Node server with npm start, or open the project through a local web server.",
            true
        );
        setDatasetStatus({
            text: "Automatic loading failed. Try the reload button or run the app through http://localhost:3000.",
            source: "Error",
            regionCount: state.regions.length,
            countyCount: state.counties.length,
            cropCount: state.crops.length,
            isError: true
        });
    });
