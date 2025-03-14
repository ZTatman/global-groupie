const AircraftCategory = Object.freeze([
    "No information",
    "No ADS-B Emitter Category Information",
    "Light (< 15500 lbs)",
    "Small (15500 to 75000 lbs)",
    "Large (75000 to 300000 lbs)",
    "High Vortex Large (aircraft such as B-757)",
    "Heavy (> 300000 lbs)",
    "High Performance (> 5g acceleration and 400 kts)",
    "Rotorcraft",
    "Glider / sailplane",
    "Lighter-than-air",
    "Parachutist / Skydiver",
    "Ultralight / hang-glider / paraglider",
    "Reserved",
    "Unmanned Aerial Vehicle",
    "Space / Trans-atmospheric vehicle",
    "Surface Vehicle – Emergency Vehicle",
    "Surface Vehicle – Service Vehicle",
    "Point Obstacle (includes tethered balloons)",
    "Cluster Obstacle",
    "Line Obstacle",
]);

const OpenSkyAllProperties = Object.freeze({
    ICAO24: "icao24",
    CALLSIGN: "callsign",
    ORIGIN_COUNTRY: "origin_country",
    TIME_POSITION: "time_position",
    LAST_CONTACT: "last_contact",
    LONGITUDE: "longitude",
    LATITUDE: "latitude",
    BARO_ALTITUDE: "baro_altitude",
    ON_GROUND: "on_ground",
    VELOCITY: "velocity",
    TRUE_TRACK: "true_track",
    VERTICAL_RATE: "vertical_rate",
    SENSORS: "sensors",
    GEO_ALTITUDE: "geo_altitude",
    SQUAWK: "squawk",
    SPI: "spi",
    POSITION_SOURCE: "position_source",
    CATEGORY: "category",
});

const OpenSkyPropertiesByIndex = Object.freeze({
    0: OpenSkyAllProperties.ICAO24,
    1: OpenSkyAllProperties.CALLSIGN,
    2: OpenSkyAllProperties.ORIGIN_COUNTRY,
    3: OpenSkyAllProperties.TIME_POSITION,
    4: OpenSkyAllProperties.LAST_CONTACT,
    5: OpenSkyAllProperties.LONGITUDE,
    6: OpenSkyAllProperties.LATITUDE,
    7: OpenSkyAllProperties.BARO_ALTITUDE,
    8: OpenSkyAllProperties.ON_GROUND,
    9: OpenSkyAllProperties.VELOCITY,
    10: OpenSkyAllProperties.TRUE_TRACK,
    11: OpenSkyAllProperties.VERTICAL_RATE,
    12: OpenSkyAllProperties.SENSORS,
    13: OpenSkyAllProperties.GEO_ALTITUDE,
    14: OpenSkyAllProperties.SQUAWK,
    15: OpenSkyAllProperties.SPI,
    16: OpenSkyAllProperties.POSITION_SOURCE,
    17: OpenSkyAllProperties.CATEGORY,
});

const PositionSource = Object.freeze(["ADS-B", "ASTERIX", "MLAT", "FLARM"]);

const AirplaneAltitudeColors = Object.freeze({
    DEFAULT: Cesium.Color.GREEN,
    HIGH: Cesium.Color.RED,
    MEDIUM: Cesium.Color.ORANGE,
    LOW: Cesium.Color.YELLOW,
});

const SvgIcons = Object.freeze({
    POINT: "PHN2ZyBoZWlnaHQ9IjY0IiB3aWR0aD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHN0cm9rZT0iIzAwMCIgdHJhbnNmb3JtPSJyb3RhdGUoMjcwKSI+PGcgc3Ryb2tlLXdpZHRoPSIwIi8+PGcgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTQ5MC43IDBjLTIxLjMgMC00Mi43IDAtNTMuMyAxMC43bC04NS4zIDk2SDIxLjNMMCAxMzguN2wyMzQuNyA3NC43LTY0IDg1LjNoLTk2bC0zMiAzMiA2NCAyMS4zdjMyYy43IDExLjUgMTAuNyAyMS4zIDIxLjMgMjEuM2gzMmwyMS4zIDY0IDMyLTMydi05Nmw4NS4zLTY0TDM3My4zIDUxMmwzMi0yMS4zVjE2MGw5Ni04NS4zQzUxMiA2NCA1MTIgNDIuNyA1MTIgMjEuMyA1MTIgMTAuNyA1MDEuMyAwIDQ5MC43IDB6Ii8+PC9zdmc+",
    AIRPLANE:
        "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNMi4wNTguNDQxYy0uMTE0LS4yMjMtLjE3OS0uMjAzLS4xNDQuMDQ1TDUuMzIgMjMuODUyYS40NjcuNDY3IDAgMCAwIC42NDguMDMzbDUuMzY0LTQuNzM4YS42MS42MSAwIDAgMCAuMTMyLS43MDR6bTIwLjAwOCAxMy4xOTVMMi43MzEuMDgyYy0uMjA2LS4xNDItLjI1NC0uMDk1LS4xMDYuMTA5bDExLjg0NyAxNi41YS42MS42MSAwIDAgMCAuNjg4LjE5OGw2LjY0NS0yLjY1OWEuNDY3LjQ2NyAwIDAgMCAuMjYzLS41OTNNMy43OTcgMi42MjdjLS4xMjEtLjE3My0uMTM5LS4xNjItLjA0LjAyNGw3Ljk2NSAxNC43OTFjLjEuMTg1LjE2OC4xNjYuMTUxLS4wNDRsLS4xMS0xLjM4M2MtLjAxNy0uMjEuMTI1LS4zMDguMzE2LS4yMTdsMS4xNTYuNTQ1Yy4xOTEuMDkuMjQ4LjAyMi4xMjctLjE1eiIvPjwvc3ZnPg==",
});

export { AircraftCategory, OpenSkyAllProperties, OpenSkyPropertiesByIndex, PositionSource, AirplaneAltitudeColors, SvgIcons };
