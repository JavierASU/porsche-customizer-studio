import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface PorscheCarProps {
  bodyColor: string;
  wheelColor: string;
  interiorColor: string;
  autoRotate: boolean;
  variant: '964' | '993';
}

/* ─── 964 body profile: upright classic stance ─── */
function createBody964(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-2.25, 0.22);
  s.lineTo(-2.25, 0.42);
  s.bezierCurveTo(-2.22, 0.62, -2.1, 0.72, -1.85, 0.76);
  s.lineTo(-1.5, 0.78);
  s.bezierCurveTo(-1.2, 0.8, -0.9, 0.84, -0.6, 0.92);
  s.bezierCurveTo(-0.3, 1.02, -0.1, 1.1, 0.1, 1.16);
  s.lineTo(0.35, 1.2);
  s.lineTo(0.7, 1.2);
  s.bezierCurveTo(0.95, 1.18, 1.1, 1.1, 1.25, 0.98);
  s.bezierCurveTo(1.4, 0.86, 1.55, 0.74, 1.65, 0.68);
  s.bezierCurveTo(1.85, 0.58, 2.05, 0.52, 2.2, 0.5);
  s.lineTo(2.3, 0.48);
  s.bezierCurveTo(2.35, 0.44, 2.35, 0.36, 2.35, 0.28);
  s.lineTo(2.35, 0.22);
  s.lineTo(-2.25, 0.22);
  return new THREE.ExtrudeGeometry(s, {
    steps: 2, depth: 1.55, bevelEnabled: true,
    bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 8,
  });
}

/* ─── 993 body profile: wider, lower, smoother ─── */
function createBody993(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-2.35, 0.18);
  s.lineTo(-2.35, 0.38);
  s.bezierCurveTo(-2.3, 0.58, -2.15, 0.68, -1.92, 0.72);
  s.lineTo(-1.55, 0.74);
  s.bezierCurveTo(-1.25, 0.76, -0.95, 0.8, -0.65, 0.88);
  s.bezierCurveTo(-0.35, 0.96, -0.15, 1.04, 0.05, 1.1);
  s.lineTo(0.3, 1.14);
  s.lineTo(0.75, 1.14);
  s.bezierCurveTo(1.0, 1.12, 1.15, 1.04, 1.3, 0.92);
  s.bezierCurveTo(1.48, 0.78, 1.65, 0.66, 1.75, 0.6);
  s.bezierCurveTo(1.95, 0.5, 2.15, 0.44, 2.3, 0.42);
  s.lineTo(2.42, 0.4);
  s.bezierCurveTo(2.46, 0.36, 2.46, 0.28, 2.46, 0.22);
  s.lineTo(2.46, 0.18);
  s.lineTo(-2.35, 0.18);
  return new THREE.ExtrudeGeometry(s, {
    steps: 2, depth: 1.7, bevelEnabled: true,
    bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 8,
  });
}

/* ─── Wheel assembly ─── */
function Wheel({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.28, 0.1, 20, 40]} />
        <meshStandardMaterial color="#111" roughness={0.95} metalness={0} />
      </mesh>
      {/* Rim outer */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.13, 40]} />
        <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.05} clearcoat={0.8} envMapIntensity={2} />
      </mesh>
      {/* Hub */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.15, 20]} />
        <meshPhysicalMaterial color={color} metalness={0.98} roughness={0.02} />
      </mesh>
      {/* Fuchs-style spokes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.028, 0.2, 0.07]} />
            <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.05} envMapIntensity={2} />
          </mesh>
        </group>
      ))}
      {/* Brake caliper hint */}
      <mesh position={[0.08, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.05, 0.06, 0.03]} />
        <meshStandardMaterial color="#cc0000" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Headlights ─── */
function Headlights({ variant }: { variant: '964' | '993' }) {
  const z = variant === '964' ? 0.42 : 0.5;
  const r = variant === '964' ? 0.12 : 0.09;
  const x = variant === '964' ? -2.08 : -2.18;
  const y = variant === '964' ? 0.52 : 0.48;
  return (
    <group>
      {[z, -z].map((pz, i) => (
        <group key={i} position={[x, y, pz]}>
          {/* Lens */}
          <mesh>
            <sphereGeometry args={[r, 20, 20, 0, Math.PI * 0.6]} />
            <meshPhysicalMaterial
              color="#ffffff"
              emissive="#ffffcc"
              emissiveIntensity={0.15}
              transparent opacity={0.85}
              roughness={0}
              transmission={0.3}
              clearcoat={1}
            />
          </mesh>
          {/* Chrome ring */}
          <mesh>
            <torusGeometry args={[r, 0.012, 12, 32]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={1} roughness={0.02} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─── Tail lights ─── */
function TailLights({ variant }: { variant: '964' | '993' }) {
  const x = variant === '964' ? 2.18 : 2.28;
  const y = variant === '964' ? 0.42 : 0.38;
  const width = variant === '993' ? 0.28 : 0.2;
  return (
    <group>
      {[0.48, -0.48].map((pz, i) => (
        <mesh key={i} position={[x, y, pz]} castShadow>
          <boxGeometry args={[0.04, 0.08, width]} />
          <meshPhysicalMaterial
            color="#cc0000"
            emissive="#ff0000"
            emissiveIntensity={0.4}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Interior ─── */
function Interior({ color }: { color: string }) {
  return (
    <group>
      {/* Seats */}
      {[0.2, -0.2].map((pz, i) => (
        <group key={i} position={[0.15, 0.36, pz]}>
          {/* Base */}
          <mesh>
            <boxGeometry args={[0.32, 0.06, 0.22]} />
            <meshPhysicalMaterial color={color} roughness={0.65} metalness={0} clearcoat={0.2} />
          </mesh>
          {/* Backrest */}
          <mesh position={[-0.06, 0.16, 0]}>
            <boxGeometry args={[0.06, 0.26, 0.2]} />
            <meshPhysicalMaterial color={color} roughness={0.65} metalness={0} clearcoat={0.2} />
          </mesh>
          {/* Headrest */}
          <mesh position={[-0.06, 0.32, 0]}>
            <boxGeometry args={[0.05, 0.08, 0.12]} />
            <meshPhysicalMaterial color={color} roughness={0.7} metalness={0} />
          </mesh>
        </group>
      ))}
      {/* Dashboard */}
      <mesh position={[-0.35, 0.42, 0]}>
        <boxGeometry args={[0.12, 0.08, 1.0]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Steering wheel */}
      <mesh position={[-0.26, 0.5, 0.24]} rotation={[0.35, 0, 0]}>
        <torusGeometry args={[0.075, 0.01, 12, 28]} />
        <meshStandardMaterial color="#111" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Center console */}
      <mesh position={[0.0, 0.32, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ─── main component ─── */
export default function PorscheCar({ bodyColor, wheelColor, interiorColor, autoRotate, variant }: PorscheCarProps) {
  const groupRef = useRef<THREE.Group>(null);

  const bodyGeo = useMemo(() => {
    const g = variant === '964' ? createBody964() : createBody993();
    g.center();
    return g;
  }, [variant]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  const wheelZ = variant === '993' ? 0.8 : 0.72;
  const wheels: [number, number, number][] = [
    [-1.5, -0.02, wheelZ],
    [-1.5, -0.02, -wheelZ],
    [1.4, -0.02, wheelZ],
    [1.4, -0.02, -wheelZ],
  ];

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* Body shell */}
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={bodyColor}
          metalness={0.85}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={2.5}
          reflectivity={1}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.1, 0.62, 0]} rotation={[0, 0, -0.38]} castShadow>
        <boxGeometry args={[0.65, 0.015, variant === '993' ? 1.3 : 1.15]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.1}
          roughness={0}
          transparent
          opacity={0.25}
          transmission={0.8}
          clearcoat={1}
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[0.88, 0.58, 0]} rotation={[0, 0, 0.42]}>
        <boxGeometry args={[0.5, 0.015, variant === '993' ? 1.1 : 0.95]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.1}
          roughness={0}
          transparent
          opacity={0.25}
          transmission={0.8}
          clearcoat={1}
        />
      </mesh>

      {/* Side windows */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[0.45, 0.62, side * (variant === '993' ? 0.78 : 0.71)]} rotation={[side * 0.08, 0, 0]}>
          <boxGeometry args={[0.8, 0.22, 0.012]} />
          <meshPhysicalMaterial
            color="#0a0a0a"
            transparent
            opacity={0.2}
            transmission={0.8}
            roughness={0}
            clearcoat={1}
          />
        </mesh>
      ))}

      {/* Chrome trim line */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4.4, 0.008, variant === '993' ? 1.72 : 1.57]} />
        <meshPhysicalMaterial color="#d0d0d0" metalness={1} roughness={0.02} />
      </mesh>

      {/* Front bumper */}
      <mesh position={[-2.2, 0.28, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, variant === '993' ? 1.5 : 1.35]} />
        <meshPhysicalMaterial
          color={bodyColor}
          metalness={0.85}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[2.25, 0.28, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, variant === '993' ? 1.5 : 1.35]} />
        <meshPhysicalMaterial
          color={bodyColor}
          metalness={0.85}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={2.5}
        />
      </mesh>

      {/* Door lines */}
      {[1, -1].map(side => (
        <mesh key={side} position={[-0.1, 0.48, side * (variant === '993' ? 0.79 : 0.72)]}>
          <boxGeometry args={[1.2, 0.3, 0.005]} />
          <meshPhysicalMaterial
            color={bodyColor}
            metalness={0.85}
            roughness={0.12}
            clearcoat={1}
            envMapIntensity={2}
          />
        </mesh>
      ))}

      {/* Wheels */}
      {wheels.map((pos, i) => (
        <Wheel key={i} position={pos} color={wheelColor} />
      ))}

      {/* Headlights */}
      <Headlights variant={variant} />

      {/* Tail lights */}
      <TailLights variant={variant} />

      {/* Interior */}
      <Interior color={interiorColor} />

      {/* Exhaust tips */}
      {(variant === '993' ? [0.25, -0.25] : [0.18, -0.18]).map((pz, i) => (
        <mesh key={i} position={[2.35, 0.2, pz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.035, 0.08, 16]} />
          <meshPhysicalMaterial color="#888" metalness={1} roughness={0.05} />
        </mesh>
      ))}

      {/* Rear spoiler (993 specific) */}
      {variant === '993' && (
        <mesh position={[1.9, 0.72, 0]} castShadow>
          <boxGeometry args={[0.2, 0.015, 1.2]} />
          <meshPhysicalMaterial
            color={bodyColor}
            metalness={0.85}
            roughness={0.1}
            clearcoat={1}
            envMapIntensity={2.5}
          />
        </mesh>
      )}

      {/* 964 whale tail hint */}
      {variant === '964' && (
        <mesh position={[1.85, 0.68, 0]} castShadow>
          <boxGeometry args={[0.15, 0.012, 1.0]} />
          <meshPhysicalMaterial
            color={bodyColor}
            metalness={0.85}
            roughness={0.1}
            clearcoat={1}
            envMapIntensity={2.5}
          />
        </mesh>
      )}
    </group>
  );
}
