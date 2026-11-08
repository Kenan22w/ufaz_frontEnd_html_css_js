"use strict";

// Keep the same localStorage key on both pages. localStorage stores strings only.
const STORAGE_KEY = "ufaz-driving-experiences-v1";

function loadExperiences() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) return [];
  const list = JSON.parse(saved); // Convert stored JSON text back to a JS array.
  if (!Array.isArray(list)) throw new Error("Stored driving experiences are not an array.");
  return list;
}

function nextExperienceId(list) {
  // Use the last recorded identifier +1; robust even if records are not ordered.
  return list.reduce(function (maxId, experience) {
    return Math.max(maxId, Number(experience.idExperience) || 0);
  }, 0) + 1;
}

function calculateTotalKm(list) {
  return list.reduce(function (total, experience) {
    return total + (Number(experience.km) || 0);
  }, 0);
}

function formatKm(km) {
  return (Math.round((Number(km) + 1e-9) * 10) / 10).toFixed(1) + " km";
}

function setMessage(elementId, text, error) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = text;
  element.classList.toggle("error", Boolean(error));
}

// Escape stored values before inserting HTML template literals in the table.
function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

// Same method required in Step 2B: JSON array + forEach + template literal + insertAdjacentHTML.
function writeOptions(selectId, items, idProperty, labelProperty) {
  const select = document.getElementById(selectId);
  if (!select) return;
  items.forEach(function (item) {
    const optionHTML = `<option value="${item[idProperty]}">${escapeHTML(item[labelProperty])}</option>`;
    select.insertAdjacentHTML("beforeend", optionHTML);
  });
}

function categoryLabel(items, idProperty, labelProperty, id) {
  // The form stores only the foreign-key ID. find() looks up the readable label.
  const match = items.find(function (item) {
    return item[idProperty] === Number(id);
  });
  return match ? match[labelProperty] : "Unknown";
}

function updateFormTotals() {
  const list = loadExperiences();
  document.getElementById("formCount").textContent = String(list.length);
  document.getElementById("formTotalKm").textContent = formatKm(calculateTotalKm(list));
  document.getElementById("idExperience").value = nextExperienceId(list);
}

function initializeForm() {
  writeOptions("idWeather", weatherList, "idWeather", "weather");
  writeOptions("idRoadType", roadTypeList, "idRoadType", "roadType");
  writeOptions("idTraffic", trafficList, "idTraffic", "traffic");
  writeOptions("idManeuver", maneuverList, "idManeuver", "maneuver");

  // Pressing Enter in a field must not accidentally submit to a nonexistent server.
  document.getElementById("drivingForm").addEventListener("submit", function (event) {
    event.preventDefault();
    saveDrivingExperience();
  });
  try {
    updateFormTotals();
  } catch (error) {
    setMessage("formMessage", "Cannot read saved data: " + error.message, true);
    document.getElementById("saveButton").disabled = true;
  }
}

// Called when the user clicks the <button type="button" onclick="...">.
function saveDrivingExperience() {
  const form = document.getElementById("drivingForm");
  if (!form.reportValidity()) return; // Checks the required/min/step constraints.

  try {
    const drivingExperiences = loadExperiences();
    const experience = {
      // Property names and numeric foreign keys match the submitted Step 1D JSON.
      idExperience: nextExperienceId(drivingExperiences),
      date: document.getElementById("date").value,
      startingTime: document.getElementById("startingTime").value,
      endingTime: document.getElementById("endingTime").value,
      km: Number(document.getElementById("km").value),
      idWeather: Number(document.getElementById("idWeather").value),
      idRoadType: Number(document.getElementById("idRoadType").value),
      idTraffic: Number(document.getElementById("idTraffic").value),
      idManeuver: Number(document.getElementById("idManeuver").value)
    };

    if (!Number.isFinite(experience.km) || experience.km <= 0) {
      setMessage("formMessage", "Distance must be a positive number.", true);
      return;
    }

    // Extra guard against inconsistent or manually altered select values.
    const hasCategory = function (items, key, id) {
      return items.some(function (item) { return item[key] === id; });
    };
    if (!hasCategory(weatherList, "idWeather", experience.idWeather) ||
        !hasCategory(roadTypeList, "idRoadType", experience.idRoadType) ||
        !hasCategory(trafficList, "idTraffic", experience.idTraffic) ||
        !hasCategory(maneuverList, "idManeuver", experience.idManeuver)) {
      setMessage("formMessage", "Please select a valid value for every driving condition.", true);
      return;
    }

    drivingExperiences.push(experience); // Append the JSON-compatible experience object.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivingExperiences));
    console.log("Saved experience:", experience);
    console.log("All saved driving experiences:", drivingExperiences);

    form.reset();                  // Teacher's requested reset() method.
    updateFormTotals();           // Automatically prepare the next experience ID.
    setMessage("formMessage", "Experience #" + experience.idExperience + " saved. Total distance: " + formatKm(calculateTotalKm(drivingExperiences)) + ".", false);
  } catch (error) {
    setMessage("formMessage", "Could not save: " + error.message, true);
    console.error("Saving failed:", error);
  }
}

function updateStatistics(list) {
  const distances = list.map(function (item) { return Number(item.km); }).filter(Number.isFinite);
  const total = calculateTotalKm(list);
  document.getElementById("recordCount").textContent = String(list.length);
  document.getElementById("totalDistance").textContent = formatKm(total);
  document.getElementById("averageDistance").textContent = formatKm(list.length ? total / list.length : 0);
  document.getElementById("rangeDistance").textContent = distances.length
    ? Math.min(...distances).toFixed(1) + " / " + Math.max(...distances).toFixed(1) + " km"
    : "—";
}

function displayWeatherChart(list) {
  const chart = document.getElementById("weatherChart");
  chart.replaceChildren();
  const counts = weatherList.map(function (weatherItem) {
    return {
      label: weatherItem.weather,
      count: list.filter(function (record) { return Number(record.idWeather) === weatherItem.idWeather; }).length
    };
  }).filter(function (item) { return item.count > 0; });

  if (!counts.length) {
    chart.textContent = "Save some experiences to see the weather breakdown.";
    return;
  }
  const max = Math.max(...counts.map(function (item) { return item.count; }));
  counts.forEach(function (item) {
    const width = (item.count / max) * 100;
    // All labels originate from a fixed local reference array.
    const barHTML = `<div class="bar-row"><span>${escapeHTML(item.label)}</span><div class="bar-track"><div class="bar-fill" style="width: ${width}%"></div></div><strong>${item.count}</strong></div>`;
    chart.insertAdjacentHTML("beforeend", barHTML);
  });
}

function displaySummary() {
  const records = loadExperiences();
  const weatherFilter = document.getElementById("filterWeather").value;
  const maneuverFilter = document.getElementById("filterManeuver").value;
  const shown = records.filter(function (record) {
    return (!weatherFilter || Number(record.idWeather) === Number(weatherFilter)) &&
           (!maneuverFilter || Number(record.idManeuver) === Number(maneuverFilter));
  });
  const tbody = document.getElementById("experienceRows");
  tbody.replaceChildren(); // Prevent duplicate rows when filters change.

  // Dynamic writing required by Step 3C: each row is a template literal;
  // foreign keys are translated with Array.find() and inserted in <tbody>.
  shown.forEach(function (experience) {
    const weatherName = categoryLabel(weatherList, "idWeather", "weather", experience.idWeather);
    const roadName = categoryLabel(roadTypeList, "idRoadType", "roadType", experience.idRoadType);
    const trafficName = categoryLabel(trafficList, "idTraffic", "traffic", experience.idTraffic);
    const maneuverName = categoryLabel(maneuverList, "idManeuver", "maneuver", experience.idManeuver);
    const rowHTML = `<tr>
      <th scope="row">${escapeHTML(experience.idExperience)}</th>
      <td>${escapeHTML(experience.date)}</td>
      <td>${escapeHTML(experience.startingTime)}</td>
      <td>${escapeHTML(experience.endingTime)}</td>
      <td>${escapeHTML(Number(experience.km).toFixed(1))}</td>
      <td>${escapeHTML(weatherName)}</td>
      <td>${escapeHTML(roadName)}</td>
      <td>${escapeHTML(trafficName)}</td>
      <td>${escapeHTML(maneuverName)}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", rowHTML);
  });

  document.getElementById("emptyMessage").hidden = shown.length > 0;
  document.getElementById("resultCount").textContent = "Showing " + shown.length + " of " + records.length + " experiences";
  updateStatistics(shown);
  displayWeatherChart(shown);
  console.log("Driving experiences loaded from localStorage:", records);
}

function initializeSummary() {
  writeOptions("filterWeather", weatherList, "idWeather", "weather");
  writeOptions("filterManeuver", maneuverList, "idManeuver", "maneuver");
  document.getElementById("filterWeather").addEventListener("change", displaySummary);
  document.getElementById("filterManeuver").addEventListener("change", displaySummary);
  document.getElementById("resetFilters").addEventListener("click", function () {
    document.getElementById("filterWeather").value = "";
    document.getElementById("filterManeuver").value = "";
    displaySummary();
  });
  document.getElementById("clearButton").addEventListener("click", function () {
    if (!window.confirm("Permanently delete ALL driving experiences saved in this browser?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      displaySummary();
      setMessage("summaryMessage", "All local records have been deleted.", false);
    } catch (error) {
      setMessage("summaryMessage", "Unable to delete records: " + error.message, true);
    }
  });
  try {
    displaySummary();
  } catch (error) {
    setMessage("summaryMessage", "Could not read saved data: " + error.message, true);
    console.error(error);
  }
}

// Step 3C specifies document.onreadystatechange and a readyState of "complete".
// We also support a document that was already loaded before the listener was added.
function initializeWhenReady() {
  if (document.getElementById("drivingForm")) initializeForm();
  if (document.getElementById("experienceRows")) initializeSummary();
}
let initialized = false;
function onReadyStateChange() {
  if (document.readyState === "complete" && !initialized) {
    initialized = true;
    initializeWhenReady();
  }
}
document.addEventListener("readystatechange", onReadyStateChange);
onReadyStateChange();
