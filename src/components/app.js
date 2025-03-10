// The URL on your server where CesiumJS's static files are hosted.
import Cesium from 'cesium';
import React from 'react';
import * as Resium from 'resium';
import '@/css/index.css';

// Set your Ion access token
Cesium.Ion.defaultAccessToken =
  process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN || 'your-default-token-here';

function App() {
  const [viewer, setViewer] = React.useState(null);

  const handleReady = React.useCallback(
    (tileset) => {
      if (viewer && viewer.cesiumElement) {
        viewer.zoomTo(tileset);
      }
    },
    [viewer]
  );

  const setViewerRef = React.useCallback((viewer) => {
    setViewer(viewer && viewer.cesiumEl);
  }, []);

  const startingPosition = Cesium.Cartesian3.fromDegrees(10, 10, 1000);

  return (
    <div className="App">
      <Resium.Viewer
        full
        terrainProvider={Cesium.createWorldTerrainAsync()}
        homeButton={false}
        timeline={false}
        baseLayerPicker={false}
        ref={setViewerRef}
      >
        <Resium.Cesium3DTileset url={Cesium.IonResource.fromAssetId(96188)} onReady={handleReady} />
        <Resium.Entity
          name="Test"
          position={startingPosition}
          billboard={{
            image:
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0icmVkIi8+PC9zdmc+',
            scale: 1.0,
            color: Cesium.Color.RED,
            heightReference: Cesium.HeightReference.RELATIVE_TO_3D_TILE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: 0,
            scaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.0, 1.0e6, 0.75),
            rotation: Cesium.Math.PI_OVER_FOUR,
          }}
        />
        {/* <Resium.CameraFlyTo
            destination={Cesium.Cartesian3.fromDegrees(10, 10, 10000)}
            orientation={
              new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(-90), 10000)
            }
            duration={5}
        /> */}
      </Resium.Viewer>
    </div>
  );
}

export default React.memo(App);
