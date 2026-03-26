import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import PorscheBody from './PorscheBody';
import PorscheWheels, { type WheelDesign } from './PorscheWheels';
import PorscheInterior from './PorscheInterior';
import { Headlights, TailLights } from './PorscheLights';

interface PorscheCarProps {
  bodyColor: string;
  wheelColor: string;
  interiorColor: string;
  autoRotate: boolean;
  variant: '964' | '993';
  wheelDesign: WheelDesign;
}

export default function PorscheCar({ bodyColor, wheelColor, interiorColor, autoRotate, variant, wheelDesign }: PorscheCarProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      <PorscheBody variant={variant} bodyColor={bodyColor} />
      <PorscheWheels variant={variant} color={wheelColor} design={wheelDesign} />
      <Headlights variant={variant} />
      <TailLights variant={variant} />
      <PorscheInterior color={interiorColor} />
    </group>
  );
}
