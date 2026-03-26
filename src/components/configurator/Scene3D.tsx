import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  MeshReflectorMaterial,
} from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import PorscheCar from '@/components/3d/PorscheCar';
import type { WheelDesign } from '@/components/3d/PorscheWheels';

export type HdriPreset =
  | 'studio'
  | 'sunset'
  | 'dawn'
  | 'night'
  | 'warehouse'
  | 'city';

const HDRI_MAP: Record<HdriPreset, string> = {
  studio: 'studio',
  sunset: 'sunset',
  dawn: 'dawn',
  night: 'night',
  warehouse: 'warehouse',
  city: 'city',
};

interface Scene3DProps {
  variant: '964' | '993';
  bodyColor: string;
  wheelColor: string;
  interiorColor: string;
  wheelDesign: WheelDesign;
  autoRotate: boolean;
  hdri: HdriPreset;
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[400, 200]}
        resolution={1024}
        mixBlur={1}
        mixStrength={60}
        roughness={0.8}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080808"
        metalness={0.6}
        mirror={0.6}
      />
    </mesh>
  );
}

function SceneContent({
  variant,
  bodyColor,
  wheelColor,
  interiorColor,
  wheelDesign,
}: Omit<Scene3DProps, 'hdri' | 'autoRotate'>) {
  return (
    <>
      <Center>
        <PorscheCar
          variant={variant}
          bodyColor={bodyColor}
          wheelColor={wheelColor}
          interiorColor={interiorColor}
          wheelDesign={wheelDesign}
          autoRotate={false}
        />
      </Center>
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.75}
        scale={14}
        blur={3}
        far={5}
        resolution={512}
        color="#000000"
      />
      <Floor />
    </>
  );
}

export default function Scene3D({
  variant,
  bodyColor,
  wheelColor,
  interiorColor,
  wheelDesign,
  autoRotate,
  hdri,
}: Scene3DProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 2, 4], fov: 45 }}
      gl={{ antialias: true, toneMappingExposure: 1.5 }}
      dpr={[1, 2]}
      className="w-full h-full"
    >
      <color attach="background" args={['#080808']} />
      <fog attach="fog" args={['#080808', 18, 30]} />

      {/* Main key light */}
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* Fill light */}
      <directionalLight
        position={[-6, 6, -4]}
        intensity={0.6}
        color="#b0c4de"
      />

      {/* Rim / accent light */}
      <spotLight
        position={[-8, 8, -6]}
        angle={0.2}
        penumbra={1}
        intensity={1.2}
        color="#ffffff"
      />

      {/* Top light for roof highlights */}
      <spotLight
        position={[0, 12, 0]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Ambient fill */}
      <ambientLight intensity={0.25} />

      {/* Front accent for headlights area */}
      <pointLight position={[-4, 2, 0]} intensity={0.4} color="#ffe8d0" distance={10} />

      {/* HDRI Environment */}
      <Environment preset={HDRI_MAP[hdri] as any} background={false} />

      <Suspense fallback={null}>
        <SceneContent
          variant={variant}
          bodyColor={bodyColor}
          wheelColor={wheelColor}
          interiorColor={interiorColor}
          wheelDesign={wheelDesign}
        />
      </Suspense>

      {/* Controls */}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enablePan={false}
        target={[0, 0.5, 0]}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={14}
        makeDefault
      />

      {/* Postprocessing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={0.3}
          intensity={0.6}
        />
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.02}
          bokehScale={2}
        />
      </EffectComposer>
    </Canvas>
  );
}
