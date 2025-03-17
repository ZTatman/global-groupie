import { AirplaneAltitudeColors, SvgIcons } from "@/utils/enums";

/**
 * Get the color for the airplane icon based on the altitude
 * @param {number} altitude - The altitude of the airplane
 * @returns {Cesium.Color} - The color for the airplane icon
 */
function getColorForPlane(altitude) {
    if (!altitude) return AirplaneAltitudeColors.DEFAULT;

    switch (true) {
        case altitude > 10000:
            return AirplaneAltitudeColors.HIGH;
        case altitude > 5000:
            return AirplaneAltitudeColors.MEDIUM;
        case altitude > 2000:
            return AirplaneAltitudeColors.LOW;
        default:
            return AirplaneAltitudeColors.DEFAULT;
    }
}

/**
 * Convert the Cesium color to a hex string
 * @example "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF"
 * @param {Cesium.Color} color - The color to convert
 * @returns {string} - The hex string
 */
function cesiumColorToHexByAltitude(altitude) {
    return getColorForPlane(altitude).toCssHexString();
}

/**
 * Get the airplane icon svg data uri with the altitude color
 * @param {number} altitude - The altitude of the airplane
 * @returns {string} - The airplane icon with the altitude color
 */
function getAirplaneIconWithAltitudeColor(altitude) {
    return (
        "data:image/svg+xml;base64," +
        window.btoa(window.atob(SvgIcons.AIRPLANE).replace(/#([0-9a-f]{6}|[0-9a-f]{3})/g, cesiumColorToHexByAltitude(altitude)))
    );
}

export { getColorForPlane, cesiumColorToHexByAltitude, getAirplaneIconWithAltitudeColor };
