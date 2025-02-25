import './App.css';
import { Color } from "cesium";
import { Viewer, Entity } from "resium";
import { Cartesian3 } from "cesium";
import { Ion } from "cesium";

Ion.defaultAccessToken = process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN;
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
