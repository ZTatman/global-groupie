// The URL on your server where CesiumJS's static files are hosted.
import React from 'react';
import '../css/index.css';
import { Viewer, Entity, CameraFlyTo } from 'resium';
import { Cartesian3, Color, Ion } from 'cesium';

// Set your Ion access token
Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN || 'your-default-token-here';

function App() {
  const startingPosition = Cartesian3.fromDegrees(10, 10, 1000);
  return (
    <div className="App">
      <Viewer full>
          <>
            <Entity
              name="Test"
              position={startingPosition}
              point={{ pixelSize: 10, color: Color.RED }}
            />
            <CameraFlyTo destination={startingPosition} duration={2} />
          </>
      </Viewer>
    </div>
  );
}

export default App;
