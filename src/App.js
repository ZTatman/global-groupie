// The URL on your server where CesiumJS's static files are hosted.
import React from 'react';
import './App.css';
import { Viewer, Entity } from 'resium';
import { Cartesian3, Color, Ion } from 'cesium';

// Set the base URL for Cesium's static assets
window.CESIUM_BASE_URL = '/static/cesium';

// Set your Ion access token
Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN || 'your-default-token-here';

function App() {
  return (
    <div className="App">
      <Viewer full>
        <Entity
          name="Test"
          position={Cartesian3.fromDegrees(10, 10, 1000)}
          point={{ pixelSize: 10, color: Color.RED }}
        />
      </Viewer>
    </div>
  );
}

export default App;
