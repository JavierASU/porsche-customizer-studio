import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
  MeshReflectorMaterial,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.5}
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
  autoRotate,
}: Omit<Scene3DProps, 'hdri'>) {
  return (
    <>
      <Center>
        <PorscheCar
          variant={variant}
          bodyColor={bodyColor}
          wheelColor={wheelColor}
          interiorColor={interiorColor}
          wheelDesign={wheelDesign}
          autoRotate={autoRotate}
        />
      </Center>
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.6}
        scale={12}
        blur={2.5}
        far={4}
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
      camera={{ position: [5, 2.5, 5], fov: 40 }}
      gl={{ antialias: true, toneMappingExposure: 1.2 }}
      dpr={[1, 2]}
      className="w-full h-full"
    >
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 15, 25]} />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <spotLight
        position={[10, 10, 5]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight
        position={[-10, 8, -5]}
        angle={0.2}
        penumbra={1}
        intensity={0.5}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} />

      {/* HDRI Environment */}
      <Environment preset={HDRI_MAP[hdri] as any} background={false} />

      <Suspense fallback={null}>
        <SceneContent
          variant={variant}
          bodyColor={bodyColor}
          wheelColor={wheelColor}
          interiorColor={interiorColor}
          wheelDesign={wheelDesign}
          autoRotate={autoRotate}
        />
      </Suspense>

      {/* Controls */}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3.5}
        maxDistance={12}
        makeDefault
      />

      {/* Postprocessing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.9}
          luminanceSmoothing={0.4}
          intensity={0.3}
        />
      </EffectComposer>
    </Canvas>
  );
}
