import "@/css/app.css";
import { useQuery } from "@tanstack/react-query";
import Cesium from "cesium";
import React from "react";
import * as Resium from "resium";

const svgIcons = Object.freeze({
    POINT: "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjY0IiB3aWR0aD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIHN0cm9rZT0iIzAwMCIgdHJhbnNmb3JtPSJyb3RhdGUoMjcwKSI+PGcgc3Ryb2tlLXdpZHRoPSIwIi8+PGcgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTQ5MC43IDBjLTIxLjMgMC00Mi43IDAtNTMuMyAxMC43bC04NS4zIDk2SDIxLjNMMCAxMzguN2wyMzQuNyA3NC43LTY0IDg1LjNoLTk2bC0zMiAzMiA2NCAyMS4zdjMyYy43IDExLjUgMTAuNyAyMS4zIDIxLjMgMjEuM2gzMmwyMS4zIDY0IDMyLTMydi05Nmw4NS4zLTY0TDM3My4zIDUxMmwzMi0yMS4zVjE2MGw5Ni04NS4zQzUxMiA2NCA1MTIgNDIuNyA1MTIgMjEuMyA1MTIgMTAuNyA1MDEuMyAwIDQ5MC43IDB6Ii8+PC9zdmc+",
    AIRPLANE:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIuMyA2LjVjLjUtLjUuOS0uOCAxLjItMS4xIDEuNi0xLjYgMy4yLTQuMSAyLjItNS4xcy0zLjQuNi01IDIuMmMtLjMuMy0uNi43LTEuMSAxLjJMMi42LjVDMS45LjIgMS4xLjMuNi44bC0uNi41TDYuNiA3Yy0xLjMgMS42LTIuNyAzLjEtMy40IDRsLTEuMS0uNmMtLjUtLjMtMS4yLS4zLTEuNi4ybC0uMy4zTDMgMTNsMiAyLjguMy0uM2MuNC0uNC41LTEuMS4yLTEuNkw1IDEyLjhjLjktLjcgMi40LTIuMSA0LTMuNGw1LjcgNi42LjUtLjVjLjUtLjUuNi0xLjMuMy0yeiIvPjwvc3ZnPg==",
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

function getColorForPlane(state) {
    const altitude = state[7] || 0;
    if (altitude > 10000) return Cesium.Color.RED;
    if (altitude > 5000) return Cesium.Color.ORANGE;
    if (altitude > 2000) return Cesium.Color.YELLOW;
    return Cesium.Color.GREEN;
}

// Set your Ion access token
Cesium.Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN || "your-default-token-here";

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
                const response = await fetch("https://opensky-network.org/api/states/all?lamin=24.5&lomin=-124.8&lamax=49.5&lomax=-66.9");
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

    const handleReady = React.useCallback(
        (tileset) => {
            if (!viewer) return;
            // Fly to the USA (continental US bounds)
            viewer.camera.flyTo({
                destination: Cesium.Rectangle.fromDegrees(-124.8, 24.5, -66.9, 49.5),
                duration: 3,
            });
        },
        [viewer]
    );

    const setViewerRef = React.useCallback((viewerInstance) => {
        if (viewerInstance && viewerInstance.cesiumElement) {
            setViewer(viewerInstance.cesiumElement);
        }
    }, []);

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
                {planes &&
                    planes.states.map((state) => (
                        <Resium.Entity
                            key={state[0]}
                            name={state[1]}
                            position={Cesium.Cartesian3.fromDegrees(state[5], state[6], 1000)}
                            point={{
                                pixelSize: 4.0,
                                color: getColorForPlane(state),
                                outlineColor: Cesium.Color.BLACK,
                                outlineWidth: 0.5,
                                scaleByDistance: new Cesium.NearFarScalar(10e3, 4.0, 10e6, 0.0),
                            }}
                            description={`${state[1]} - (${state[2]})`}
                        />
                    ))}
            </Resium.Viewer>
        </div>
    );
}

export default React.memo(App);
