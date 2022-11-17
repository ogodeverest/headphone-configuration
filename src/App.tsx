import { Fragment, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import Headphones from "./Headphones";
import "./App.css";

function App() {
  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 3, 3.5] }}>
      <OrbitControls />
      <ambientLight color={0x404040} intensity={0.5} />
      <spotLight color={0xffffff} intensity={0.3} position={[5, 10, 5]} />
      <Suspense>
        <Environment preset="city" />
        <Headphones />
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.35}
          scale={20}
          blur={1.5}
          far={1000}
        />
      </Suspense>
    </Canvas>
  );
}

export default App;
