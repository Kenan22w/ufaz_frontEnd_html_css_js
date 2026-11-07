"use strict";

// These IDs and labels reproduce the JSON lists submitted in Step 1B/1C.
const weatherList = [
  { idWeather: 1, weather: "Sunny" },
  { idWeather: 2, weather: "Cloudy" },
  { idWeather: 3, weather: "Light rain" },
  { idWeather: 4, weather: "Heavy rain" },
  { idWeather: 5, weather: "Foggy" },
  { idWeather: 6, weather: "Windy" },
  { idWeather: 7, weather: "Snowy" }
];

const roadTypeList = [
  { idRoadType: 1, roadType: "Urban streets" },
  { idRoadType: 2, roadType: "Residential area" },
  { idRoadType: 3, roadType: "Rural road" },
  { idRoadType: 4, roadType: "Motorway" },
  { idRoadType: 5, roadType: "Mountain road" },
  { idRoadType: 6, roadType: "Roadworks zone" }
];

const trafficList = [
  { idTraffic: 1, traffic: "Very light" },
  { idTraffic: 2, traffic: "Light" },
  { idTraffic: 3, traffic: "Moderate" },
  { idTraffic: 4, traffic: "Heavy" },
  { idTraffic: 5, traffic: "Stop-and-go" },
  { idTraffic: 6, traffic: "Severe congestion" }
];

const maneuverList = [
  { idManeuver: 1, maneuver: "Parallel parking" },
  { idManeuver: 2, maneuver: "Reverse parking" },
  { idManeuver: 3, maneuver: "Roundabout" },
  { idManeuver: 4, maneuver: "Hill start" },
  { idManeuver: 5, maneuver: "Motorway merging" },
  { idManeuver: 6, maneuver: "Three-point turn" }
];

// A previously submitted Step 1D example for comparison only. We do not
// automatically add it to a user's saved localStorage records.
const step1DExample = {
  idExperience: 1,
  date: "2026-10-28",
  startingTime: "08:30",
  endingTime: "09:20",
  km: 22.4,
  idWeather: 1,
  idRoadType: 1,
  idTraffic: 2,
  idManeuver: 3
};
