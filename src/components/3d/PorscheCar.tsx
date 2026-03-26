import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface PorscheCarProps {
  bodyColor: string;
  wheelColor: string;
  interiorColor: string;
  variant: '964' | '993';
}

function createCarBody964(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // 964 profile - more upright, classic stance
  shape.moveTo(-2.2, 0.3);
  shape.lineTo(-2.2, 0.5);
  shape.quadraticCurveTo(-2.1, 0.7, -1.8, 0.75);
  shape.lineTo(-1.4, 0.78);
  shape.quadraticCurveTo(-1.0, 0.8, -0.7, 0.85);
  shape.lineTo(-0.3, 1.05);
  shape.quadraticCurveTo(0.0, 1.15, 0.3, 1.2);
  shape.lineTo(0.7, 1.2);
  shape.quadraticCurveTo(1.0, 1.18, 1.2, 1.0);
  shape.lineTo(1.5, 0.75);
  shape.quadraticCurveTo(1.8, 0.6, 2.0, 0.55);
  shape.lineTo(2.2, 0.5);
  shape.quadraticCurveTo(2.3, 0.45, 2.3, 0.35);
  shape.lineTo(2.3, 0.3);
  shape.lineTo(-2.2, 0.3);

  const extrudeSettings = {
    steps: 1,
    depth: 1.6,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelSegments: 6,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

function createCarBody993(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // 993 profile - wider, lower, more aerodynamic
  shape.moveTo(-2.3, 0.25);
  shape.lineTo(-2.3, 0.45);
  shape.quadraticCurveTo(-2.2, 0.65, -1.9, 0.7);
  shape.lineTo(-1.5, 0.72);
  shape.quadraticCurveTo(-1.1, 0.75, -0.8, 0.82);
  shape.lineTo(-0.4, 1.0);
  shape.quadraticCurveTo(-0.1, 1.1, 0.2, 1.15);
  shape.lineTo(0.8, 1.15);
  shape.quadraticCurveTo(1.1, 1.12, 1.3, 0.95);
  shape.lineTo(1.6, 0.7);
  shape.quadraticCurveTo(1.9, 0.55, 2.1, 0.5);
  shape.lineTo(2.35, 0.45);
  shape.quadraticCurveTo(2.4, 0.38, 2.4, 0.3);
  shape.lineTo(2.4, 0.25);
  shape.lineTo(-2.3, 0.25);

  const extrudeSettings = {
    steps: 1,
    depth: 1.7,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 6,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

function Wheel({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.1, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Rim center */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.14, 16]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Spokes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[0, 0, Math.PI / 2 + (i * Math.PI * 2) / 5]} position={[0, 0, 0]}>
          <boxGeometry args={[0.03, 0.18, 0.08]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Headlights({ variant, position }: { variant: '964' | '993'; position: [number, number, number] }) {
  const radius = variant === '964' ? 0.12 : 0.1;
  return (
    <group position={position}>
      {/* Left headlight */}
      <mesh position={[0, 0, variant === '964' ? 0.45 : 0.5]}>
        <sphereGeometry args={[radius, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#ffffee" emissive="#ffffaa" emissiveIntensity={0.3} transparent opacity={0.9} />
      </mesh>
      {/* Right headlight */}
      <mesh position={[0, 0, variant === '964' ? -0.45 : -0.5]}>
        <sphereGeometry args={[radius, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#ffffee" emissive="#ffffaa" emissiveIntensity={0.3} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function TailLights({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.5]}>
        <boxGeometry args={[0.05, 0.08, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.5]}>
        <boxGeometry args={[0.05, 0.08, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function InteriorSeat({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Seat base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Seat back */}
      <mesh position={[-0.05, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.25, 0.22]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function PorscheCar({ bodyColor, wheelColor, interiorColor, variant }: PorscheCarProps) {
  const groupRef = useRef<THREE.Group>(null);

  const bodyGeometry = useMemo(() => {
    return variant === '964' ? createCarBody964() : createCarBody993();
  }, [variant]);

  // Slow rotation for showroom effect
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const wheelPositions: [number, number, number][] = [
    [-1.5, 0.0, 0.75],
    [-1.5, 0.0, -0.75],
    [1.4, 0.0, 0.75],
    [1.4, 0.0, -0.75],
  ];

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Car body */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={bodyColor}
          metalness={0.7}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.15, 0.65, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.6, 0.02, 1.2]} />
        <meshPhysicalMaterial
          color="#111111"
          metalness={0}
          roughness={0}
          transparent
          opacity={0.4}
          transmission={0.6}
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[0.9, 0.6, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.5, 0.02, 1.0]} />
        <meshPhysicalMaterial
          color="#111111"
          metalness={0}
          roughness={0}
          transparent
          opacity={0.4}
          transmission={0.6}
        />
      </mesh>

      {/* Wheels */}
      {wheelPositions.map((pos, i) => (
        <Wheel key={i} position={pos} color={wheelColor} />
      ))}

      {/* Headlights */}
      <Headlights variant={variant} position={[-2.1, 0.55, 0]} />

      {/* Tail lights */}
      <TailLights position={[2.15, 0.45, 0]} />

      {/* Interior seats (visible through glass) */}
      <InteriorSeat position={[0.2, 0.4, 0.22]} color={interiorColor} />
      <InteriorSeat position={[0.2, 0.4, -0.22]} color={interiorColor} />

      {/* Dashboard */}
      <mesh position={[-0.3, 0.45, 0]}>
        <boxGeometry args={[0.15, 0.1, 0.9]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Steering wheel */}
      <mesh position={[-0.22, 0.52, 0.25]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.08, 0.012, 8, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>

      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
    </group>
  );
}
