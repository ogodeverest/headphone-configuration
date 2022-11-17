import * as THREE from "three";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import themes, { Theme } from "./themes";

interface Nodes {
  socketSecond: THREE.Mesh;
  socketFirst: THREE.Mesh;
  bandLower: THREE.Mesh;
  caps: THREE.Mesh;
  rings: THREE.Mesh;
  rodLower: THREE.Mesh;
  rodUpper: THREE.Mesh;
  screws: THREE.Mesh;
  bandUpper: THREE.Mesh;
  gridLower: THREE.Mesh;
  speakers: THREE.Mesh;
  driverLeft: THREE.Mesh;
  driverRight: THREE.Mesh;
  gridUpper: THREE.Mesh;
  holder: THREE.Mesh;
  pads: THREE.Mesh;
  headband: THREE.Mesh;
}

interface Materials {
  socketSecond: THREE.MeshStandardMaterial;
  socketFirst: THREE.MeshStandardMaterial;
  bandLower: THREE.MeshStandardMaterial;
  caps: THREE.MeshStandardMaterial;
  rings: THREE.MeshStandardMaterial;
  rodLower: THREE.MeshStandardMaterial;
  rodUpper: THREE.MeshStandardMaterial;
  screws: THREE.MeshStandardMaterial;
  bandUpper: THREE.MeshStandardMaterial;
  gridLower: THREE.MeshStandardMaterial;
  speakers: THREE.MeshStandardMaterial;
  driverLeft: THREE.MeshStandardMaterial;
  driverRight: THREE.MeshStandardMaterial;
  gridUpper: THREE.MeshStandardMaterial;
  pads: THREE.MeshStandardMaterial;
  headband: THREE.MeshStandardMaterial;
}

type MaterialColors = {
  [key in keyof Materials]: string;
};

function generateColors(theme: Theme): MaterialColors {
  return {
    headband: theme.accent,
    socketSecond: theme.body,
    socketFirst: theme.body,
    bandLower: theme.body,
    caps: theme.body,
    rings: theme.body,
    rodLower: theme.body,
    rodUpper: theme.body,
    screws: theme.body,
    bandUpper: theme.primary,
    gridLower: theme.details,
    speakers: theme.details,
    driverLeft: theme.accent,
    driverRight: theme.accent,
    gridUpper: theme.details,
    pads: theme.primary,
  };
}

const defaultTheme: Theme = themes.find(
  (theme) => theme.name === "default"
) as Theme;

const defaultColors: MaterialColors = generateColors(defaultTheme);

type GLTFResult = GLTF & {
  nodes: Nodes;
  materials: Materials;
};

export default function Headphones(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/headphones.glb"
  ) as unknown as GLTFResult;

  const headphones = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState<keyof Materials | null>(null);
  const [selected, setSelected] = useState<keyof Materials | null>(null);

  const [colors, setColors] = useState<MaterialColors>(defaultColors);

  const [{ editMode, theme, color }, set] = useControls("model", () => ({
    editMode: false,
    theme: {
      options: themes.map((theme) => theme.name),
    },
    color: {
      value: "#ffffff",
      render: (get) => get("model.editMode"),
    },
  }));

  const setOpacity = useCallback(
    (opacity: number) => {
      Object.keys(materials).forEach((key) => {
        materials[key as keyof Materials].transparent = true;
        materials[key as keyof Materials].opacity = opacity;
      });
    },
    [materials]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    headphones.current!.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20;
    headphones.current!.rotation.x = Math.cos(t / 4) / 8;
    headphones.current!.rotation.y = Math.sin(t / 4) / 8;
    headphones.current!.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  useEffect(() => {
    const newColors = generateColors(
      themes.find((entry) => entry.name === theme) as Theme
    );
    setColors(newColors);
  }, [theme]);

  useEffect(() => {
    if (selected) {
      setColors((colors) => ({
        ...colors,
        [selected!]: color,
      }));
    }
  }, [color, selected]);

  useEffect(() => {
    setOpacity(editMode ? 0.6 : 1);
  }, [editMode, setOpacity]);

  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${
      hovered ? `#${materials[hovered].color.getHexString()}` : "#000"
    }"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
        cursor
      )}'), auto`;
    }
    return () => {
      document.body.style.cursor = `auto`;
    };
  }, [hovered]);

  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const material = (event.object as THREE.Mesh)
        .material as THREE.MeshStandardMaterial;
      if (editMode) {
        setOpacity(0.6);
        material.opacity = 1;
        setSelected(material.name as keyof Materials);
        set({
          color: `#${material.color.getHexString()}`,
        });
      }
    },
    [set, editMode, setOpacity]
  );

  const handlePointerOver = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      const material = (event.object as THREE.Mesh)
        .material as THREE.MeshStandardMaterial;
      setHovered(material.name as keyof Materials);
    },
    [setHovered]
  );

  const handlePointerOut = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (event.intersections.length === 0) setHovered(null);
    },
    [setHovered]
  );

  return (
    <group
      {...props}
      ref={headphones}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group
        name="headphones"
        position={[-0.0001, -0.0189, 0.0131]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.0223}
      >
        <group name="body" position={[0, 0.9663, 2.4572]}>
          <group name="usbSocket" position={[25.8902, -0.9663, 1.5339]}>
            <mesh
              name="socketSecond"
              castShadow
              receiveShadow
              geometry={nodes.socketSecond.geometry}
              material={materials.socketSecond}
              position={[4.9052, 0, 14.8485]}
              material-color={colors.socketSecond}
            />
            <mesh
              name="socketFirst"
              castShadow
              receiveShadow
              geometry={nodes.socketFirst.geometry}
              material={materials.socketFirst}
              position={[1.989, 0, 15.9099]}
              material-color={colors.socketFirst}
            />
          </group>
          <mesh
            name="bandLower"
            castShadow
            receiveShadow
            geometry={nodes.bandLower.geometry}
            material={materials.bandLower}
            position={[0, -0.9577, 50.2106]}
            material-color={colors.bandLower}
          />

          <mesh
            name="caps"
            castShadow
            receiveShadow
            geometry={nodes.caps.geometry}
            material={materials.caps}
            position={[0.0035, -0.9663, 0]}
            material-color={colors.caps}
          />
          <mesh
            name="rings"
            castShadow
            receiveShadow
            geometry={nodes.rings.geometry}
            material={materials.rings}
            position={[-0.0208, -0.7993, 49.4499]}
            material-color={colors.rings}
          />
          <mesh
            name="rodLower"
            castShadow
            receiveShadow
            geometry={nodes.rodLower.geometry}
            material={materials.rodLower}
            position={[-0.0208, 15.1014, 14.5839]}
            material-color={colors.rodLower}
          />
          <mesh
            name="rodUpper"
            castShadow
            receiveShadow
            geometry={nodes.rodUpper.geometry}
            material={materials.rodUpper}
            position={[-0.0208, -0.7993, 32.0922]}
            material-color={colors.rodUpper}
          />
          <mesh
            name="screws"
            castShadow
            receiveShadow
            geometry={nodes.screws.geometry}
            material={materials.screws}
            position={[-0.0208, -0.9663, 7.0341]}
            material-color={colors.screws}
          />
          <mesh
            name="bandUpper"
            castShadow
            receiveShadow
            geometry={nodes.bandUpper.geometry}
            material={materials.bandUpper}
            position={[0, -0.9577, 51.4343]}
            rotation={[Math.PI / 2, 0, 0]}
            material-color={colors.bandUpper}
          />
        </group>
        <group name="drivers" position={[-0.0208, 0.1348, 8.3093]}>
          <mesh
            name="gridLower"
            castShadow
            receiveShadow
            geometry={nodes.gridLower.geometry}
            material={materials.gridLower}
            material-color={colors.gridLower}
          />
          <mesh
            name="speakers"
            castShadow
            receiveShadow
            geometry={nodes.speakers.geometry}
            material={materials.speakers}
            position={[0, -0.415, 1.092]}
            material-color={colors.speakers}
          />
          <mesh
            name="driverLeft"
            castShadow
            receiveShadow
            geometry={nodes.driverLeft.geometry}
            material={materials.driverLeft}
            position={[20.1207, -0.8598, 14.6182]}
            rotation={[0, -1.2241, -Math.PI / 2]}
            scale={0.0796}
            material-color={colors.driverLeft}
          />
          <mesh
            name="driverRight"
            castShadow
            receiveShadow
            geometry={nodes.driverRight.geometry}
            material={materials.driverRight}
            position={[-19.8544, -0.1149, 14.5522]}
            rotation={[0, 1.2225, Math.PI / 2]}
            scale={0.0756}
            material-color={colors.driverRight}
          />
          <mesh
            name="gridUpper"
            castShadow
            receiveShadow
            geometry={nodes.gridUpper.geometry}
            material={materials.gridUpper}
            position={[0, 0, 0.0812]}
            material-color={colors.gridUpper}
          />
        </group>
        <group name="fabric" position={[16.4948, 0, 0]}>
          <mesh
            name="holder"
            castShadow
            receiveShadow
            geometry={nodes.holder.geometry}
            material={materials.caps}
            position={[-16.5156, 0, 0.7685]}
            material-color={colors.caps}
          />
          <mesh
            name="pads"
            castShadow
            receiveShadow
            geometry={nodes.pads.geometry}
            material={materials.pads}
            position={[-16.5156, 0, 0]}
            material-color={colors.pads}
          />
        </group>
      </group>
      <mesh
        name="headband"
        castShadow
        receiveShadow
        geometry={nodes.headband.geometry}
        material={materials.headband}
        position={[-0.0001, 0.08, -0.014]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.0223}
        material-color={colors.headband}
      />
    </group>
  );
}

useGLTF.preload("/headphones.glb");
