import "@/css/app.css";
import { useQuery } from "@tanstack/react-query";
import Cesium from "cesium";
import React from "react";
import * as Resium from "resium";
import { AircraftCategory, PositionSource, OpenSkyPropertiesByIndex } from "@/utils/enums";
import { getColorForPlane, getAirplaneIconWithAltitudeColor } from "@/utils/functions";
// Set your Ion access token
Cesium.Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN || "your-default-token-here";

const BoundingBox = Object.freeze({
    US: {
        lamin: 24.5,
        lomin: -124.8,
        lamax: 49.5,
        lomax: -66.9,
    },
});

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <h2>Loading...</h2>
                <div className="loading-spinner"></div>
                <p>Preparing terrain data and 3D view...</p>
            </div>
        </div>
    );
}

function App() {
    const [viewer, setViewer] = React.useState(null);
    const [terrainProvider, setTerrainProvider] = React.useState(null);
    const isCesiumLoading = !viewer || !terrainProvider;

    const {
        isPending,
        isError,
        data: planes,
        error,
    } = useQuery({
        queryKey: ["planes"],
        queryFn: async () => {
            try {
                const response = await fetch(
                    `https://opensky-network.org/api/states/all?lamin=${BoundingBox.US.lamin}&lomin=${BoundingBox.US.lomin}&lamax=${BoundingBox.US.lamax}&lomax=${BoundingBox.US.lomax}`
                );
                if (!response.ok) {
                    const errorMessages = {
                        400: "Invalid request",
                        404: "Not found",
                        429: "Rate limit exceeded",
                        500: "Internal server error",
                        502: "Bad gateway",
                        503: "Service unavailable",
                        504: "Gateway timeout",
                    };
                    const message = errorMessages[response.status] || `Response status: ${response.status}`;
                    throw new Error(message);
                }
                return await response.json();
            } catch (e) {
                console.error(":: Error Message: ", e.message);
                return null;
            }
        },
        enabled: !isCesiumLoading, // Only fetch when viewer and terrain are loaded
        refetchInterval: 30_000,
        retry: 3,
    });

    const convertedPlanes = React.useMemo(() => {
        const _convertedPlanes = Object.assign({}, planes, {
            time: planes?.time,
            states: planes?.states?.map((stateVector) => {
                const stateObject = {};
                stateVector.forEach((value, index) => {
                    stateObject[OpenSkyPropertiesByIndex[index]] = value;
                });
                return Object.freeze({
                    ...stateObject,
                    imageUri: getAirplaneIconWithAltitudeColor(stateObject.geo_altitude),
                    color: getColorForPlane(stateObject.geo_altitude),
                });
            }),
        });
        return _convertedPlanes;
    }, [planes]);

    const setViewerRef = React.useCallback((viewerInstance) => {
        if (viewerInstance && viewerInstance.cesiumElement) {
            setViewer(viewerInstance.cesiumElement);
        }
    }, []);

    const handleReady = React.useCallback((tileset) => {
        if (!tileset) return;
        setDataSource(tileset);
    }, []);

    React.useEffect(() => {
        if (!viewer) return;
        // Fly to the USA (continental US bounds)
        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(-124.8, 24.5, -66.9, 49.5),
            duration: 3,
        });
    }, [viewer]);

    React.useEffect(() => {
        async function loadTerrain() {
            try {
                const worldTerrain = await Cesium.createWorldTerrainAsync({
                    requestWaterMask: true,
                    requestVertexNormals: true,
                });
                setTerrainProvider(worldTerrain);
            } catch (error) {
                console.error("Failed to load terrain:", error);
            }
        }
        loadTerrain();
    }, []);

    const isLoading = isCesiumLoading || isPending;
    return (
        <div className="App">
            {isLoading && <LoadingScreen />}
            <Resium.Viewer
                full
                terrainProvider={terrainProvider}
                homeButton={false}
                timeline={false}
                baseLayerPicker={false}
                ref={setViewerRef}>
                <Resium.Cesium3DTileset url={Cesium.IonResource.fromAssetId(96188)} onReady={handleReady} />
                {!isLoading &&
                    convertedPlanes?.states.map((vector) => (
                        <Resium.Entity
                            key={vector.icao24}
                            name={vector.callsign}
                            position={Cesium.Cartesian3.fromDegrees(vector.longitude, vector.latitude, 1000)}
                            onClick={(e) => {
                                const cameraPosition = viewer.camera.positionCartographic;

                                viewer.camera.flyTo({
                                    destination: Cesium.Cartesian3.fromDegrees(vector.longitude, vector.latitude, cameraPosition.height),
                                    duration: 1.5,
                                });
                            }}>
                            <Resium.BillboardGraphics image={vector.imageUri} scale={0.5} verticalOrigin={Cesium.VerticalOrigin.BOTTOM} />
                            <Resium.EntityDescription>
                                <div className="entity-description">
                                    <h2>Aircraft: {vector.callsign}</h2>
                                    <table className="info-table">
                                        <tbody>
                                            <tr>
                                                <td>Callsign:</td>
                                                <td>{vector.callsign}</td>
                                            </tr>
                                            <tr>
                                                <td>Aircraft Category:</td>
                                                <td>{AircraftCategory[vector.category]}</td>
                                            </tr>
                                            <tr>
                                                <td>Origin Country:</td>
                                                <td>{vector.origin_country}</td>
                                            </tr>
                                            <tr>
                                                <td>Coordinates:</td>
                                                <td>{`Longitude: ${vector.longitude}, Latitude: ${vector.latitude}`}</td>
                                            </tr>
                                            <tr>
                                                <td>Barometric Altitude:</td>
                                                <td>{vector.baro_altitude} meters</td>
                                            </tr>
                                            <tr>
                                                <td>Geometric Altitude:</td>
                                                <td>{vector.geo_altitude} meters</td>
                                            </tr>
                                            <tr>
                                                <td>Velocity:</td>
                                                <td>{vector.velocity} m/s</td>
                                            </tr>
                                            <tr>
                                                <td>Position Source:</td>
                                                <td>{PositionSource[vector.position_source]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="description-footer">
                                        <p className="data-citation">
                                            Data provided by{" "}
                                            <a href="https://opensky-network.org" target="_blank" rel="noopener noreferrer">
                                                The OpenSky Network
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </Resium.EntityDescription>
                        </Resium.Entity>
                    ))}
            </Resium.Viewer>
        </div>
    );
}

export default React.memo(App);
