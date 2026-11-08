"use strict";

// Step 1B — Weather conditions
const weatherList = [
  { idWeather: 1, weather: "Sunny" },
  { idWeather: 2, weather: "Cloudy" },
  { idWeather: 3, weather: "Light rain" },
  { idWeather: 4, weather: "Heavy rain" },
  { idWeather: 5, weather: "Foggy" },
  { idWeather: 6, weather: "Windy" },
  { idWeather: 7, weather: "Snowy" }
];

// Step 1C — Road types
const roadTypeList = [
  { idRoadType: 1, roadType: "Urban streets" },
  { idRoadType: 2, roadType: "Motorway" },
  { idRoadType: 3, roadType: "Rural roads" },
  { idRoadType: 4, roadType: "Residential streets" },
  { idRoadType: 5, roadType: "Mountain roads" }
];

// Step 1C — Traffic conditions
const trafficList = [
  { idTraffic: 1, traffic: "Light" },
  { idTraffic: 2, traffic: "Moderate" },
  { idTraffic: 3, traffic: "Heavy" },
  { idTraffic: 4, traffic: "Stop-and-go" },
  { idTraffic: 5, traffic: "Congested" }
];

// Step 1C — Maneuvers
const maneuverList = [
  { idManeuver: 1, maneuver: "Parallel parking" },
  { idManeuver: 2, maneuver: "Roundabout" },
  { idManeuver: 3, maneuver: "Hill start" },
  { idManeuver: 4, maneuver: "Reverse parking" },
  { idManeuver: 5, maneuver: "Lane changing" }
];

// Step 1D — Original example
const step1DExample = {
  idExperience: 1,
  date: "2026-10-28",
  startingTime: "08:30",
  endingTime: "09:20",
  km: 22.4,
  idWeather: 1,
  idRoadType: 1,
  idTraffic: 2,
  idManeuver: 1
};