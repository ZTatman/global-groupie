import "@/css/app.css";
import { useQuery } from "@tanstack/react-query";
import Cesium from "cesium";
import React from "react";
import * as Resium from "resium";
import { AircraftCategory, PositionSource, OpenSkyPropertiesByIndex } from "@/utils/enums";
import { getAirplaneIconWithAltitudeColor } from "@/utils/functions";
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
/**
 * Renders an error dialog when API request fails
 * Displays appropriate error message to the user
 */
const ErrorDialog = React.memo(({ error, isError }) => {
    if (!isError || !error) return null;

    return (
        <dialog open className="error-dialog">
            <div className="error-content">
                <h2>Error Loading Flight Data</h2>
                <p className="error-message">{error.message || "An unexpected error occurred while fetching flight data."}</p>
                <p>Please try again later or contact support if the problem persists.</p>
                <button onClick={() => document.querySelector(".error-dialog").close()}>Close</button>
            </div>
        </dialog>
    );
});
ErrorDialog.displayName = "ErrorDialog";
function App() {
    const [viewer, setViewer] = React.useState(null);
    const [terrainProvider, setTerrainProvider] = React.useState(null);
    const [tileset, setTileset] = React.useState(null);
    // const [cameraAltitude, setCameraAltitude] = React.useState(1000);
    const isCesiumLoading = !viewer || !terrainProvider || !tileset;

    /**
     * Fetches plane data from the OpenSky API, using the useQuery hook from react-query.
     * Handles various error scenarios and retries on failure.
     * link: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
     */
    const {
        isPending,
        data: planes,
        error,
        isError,
    } = useQuery({
        queryKey: ["planes"],
        queryFn: async () => {
            const response = await fetch(
                `http://localhost:5000/api/flights?lamin=${BoundingBox.US.lamin}&lamax=${BoundingBox.US.lamax}&lomin=${BoundingBox.US.lomin}&lomax=${BoundingBox.US.lomax}`
            );
            if (!response.ok) {
                console.error(`:: Error fetching flight data: ${response.statusText}`);
                throw new Error(response.statusText);
            }
            return await response.json();
        },
        enabled: !isCesiumLoading, // Only fetch when viewer, terrain, and tileset are loaded.
        refetchInterval: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    /**
     * Memoized conversion of raw plane data from OpenSky API to a more usable format.
     * Transforms array-based state vectors into objects with named properties and adds
     * altitude-based styling (colors and icons) for visualization.
     */
    const convertedPlanes = React.useMemo(() => {
        const _convertedPlanes = Object.assign({}, planes, {
            time: planes?.time ?? null,
            states: planes?.states
                ?.filter((stateVector) => {
                    return stateVector.longitude !== null && stateVector.latitude !== null;
                })
                .map((stateVector) => {
                    const stateObject = {};
                    stateVector.forEach((value, index) => {
                        stateObject[OpenSkyPropertiesByIndex[index]] = value;
                    });
                    return Object.freeze({
                        ...stateObject,
                        imageUri: getAirplaneIconWithAltitudeColor(stateObject.geo_altitude),
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

    const handleTilesetReady = React.useCallback((tileset) => {
        if (!tileset) return;
        setTileset(tileset);
    }, []);

    /**
     * Effect hook to handle the viewer instance.
     * Flies to the USA (continental US bounds) when the viewer is ready.
     */
    React.useEffect(() => {
        if (!viewer) return;
        // Fly to the USA (continental US bounds)
        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(-124.8, 24.5, -66.9, 49.5),
            duration: 3,
        });
    }, [viewer]);

    /**
     * Effect hook to handle the terrain provider.
     * Creates a world terrain provider when the terrain provider is ready.
     */
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
    console.log(":: isError, error", isError, error);
    return (
        <div className="App">
            {isLoading && <LoadingScreen />}
            <ErrorDialog error={error} isError={isError} />
            <Resium.Viewer
                full
                terrainProvider={terrainProvider}
                homeButton={false}
                timeline={false}
                baseLayerPicker={false}
                ref={setViewerRef}>
                <Resium.Cesium3DTileset url={Cesium.IonResource.fromAssetId(96188)} onReady={handleTilesetReady} />
                {/* <Resium.CustomDataSource> */}
                {!isLoading &&
                    convertedPlanes?.states &&
                    convertedPlanes.states.length > 0 &&
                    convertedPlanes.states.map((vector) => {
                        return (
                            <Resium.Entity
                                key={vector.icao24}
                                name={vector.callsign}
                                position={Cesium.Cartesian3.fromDegrees(vector.longitude, vector.latitude, vector.geo_altitude || 1000)}
                                rotation={Cesium.Math.toRadians(vector.true_track || 0)}
                                onClick={(e) => {
                                    const cameraPosition = viewer.camera.positionCartographic;
                                    // fly to the aircraft, keep the camera height the same.

                                    viewer.camera.flyTo({
                                        destination: Cesium.Cartesian3.fromDegrees(
                                            vector.longitude,
                                            vector.latitude,
                                            cameraPosition.height
                                        ),
                                        duration: 1.5,
                                    });
                                }}>
                                <Resium.BillboardGraphics
                                    image={vector.imageUri}
                                    scale={0.5}
                                    rotation={Cesium.Math.toRadians(vector.true_track || 0)}
                                    verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
                                />
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
                        );
                    })}
                {/* </Resium.CustomDataSource> */}
            </Resium.Viewer>
        </div>
    );
}

export default React.memo(App);
