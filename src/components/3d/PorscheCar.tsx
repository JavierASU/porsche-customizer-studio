import * as THREE from 'three';
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

export default function PorscheCar({ bodyColor, wheelColor, interiorColor, variant, wheelDesign }: PorscheCarProps) {
  return (
    <group position={[0, -0.15, 0]}>
      <PorscheBody variant={variant} bodyColor={bodyColor} />
      <PorscheWheels variant={variant} color={wheelColor} design={wheelDesign} />
      <Headlights variant={variant} />
      <TailLights variant={variant} />
      <PorscheInterior color={interiorColor} />
    </group>
  );
}
