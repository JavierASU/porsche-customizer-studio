import * as THREE from 'three';

export type WheelDesign = 'fuchs' | 'cup' | 'turbo-twist';

interface WheelProps {
  position: [number, number, number];
  color: string;
  design: WheelDesign;
}

/* ─── Fuchs-style classic spokes ─── */
function FuchsSpokes({ color }: { color: string }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.028, 0.2, 0.07]} />
            <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.05} envMapIntensity={2} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ─── Cup design: thin multi-spoke ─── */
function CupSpokes({ color }: { color: string }) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 10]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.015, 0.19, 0.04]} />
            <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.03} envMapIntensity={2.5} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ─── Turbo Twist: curved twisted spokes ─── */
function TurboTwistSpokes({ color }: { color: string }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            {/* Main spoke */}
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
              <boxGeometry args={[0.035, 0.18, 0.05]} />
              <meshPhysicalMaterial color={color} metalness={0.95} roughness={0.04} envMapIntensity={2.5} />
            </mesh>
            {/* Twist element */}
            <mesh rotation={[0, 0.3, Math.PI / 2]} position={[0, 0.05, 0]}>
              <boxGeometry args={[0.02, 0.14, 0.035]} />
              <meshPhysicalMaterial color={color} metalness={0.92} roughness={0.06} envMapIntensity={2} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function Wheel({ position, color, design }: WheelProps) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.28, 0.1, 24, 48]} />
        <meshStandardMaterial color="#111" roughness={0.92} metalness={0} />
      </mesh>
      {/* Tire sidewall detail */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.098, 24, 48]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Rim outer */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.13, 48]} />
        <meshPhysicalMaterial color={color} metalness={0.96} roughness={0.04} clearcoat={0.9} envMapIntensity={2.5} />
      </mesh>
      {/* Rim lip */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.24, 0.012, 16, 48]} />
        <meshPhysicalMaterial color={color} metalness={0.98} roughness={0.02} />
      </mesh>
      {/* Hub */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.15, 24]} />
        <meshPhysicalMaterial color={color} metalness={0.98} roughness={0.02} />
      </mesh>
      {/* Hub cap / center crest */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.08, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 20]} />
        <meshPhysicalMaterial color="#222" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Spokes by design */}
      {design === 'fuchs' && <FuchsSpokes color={color} />}
      {design === 'cup' && <CupSpokes color={color} />}
      {design === 'turbo-twist' && <TurboTwistSpokes color={color} />}

      {/* Brake caliper */}
      <mesh position={[0.08, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.05, 0.06, 0.03]} />
        <meshStandardMaterial color="#cc0000" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Brake disc */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

interface PorscheWheelsProps {
  variant: '964' | '993';
  color: string;
  design: WheelDesign;
}

export default function PorscheWheels({ variant, color, design }: PorscheWheelsProps) {
  const wheelZ = variant === '993' ? 0.8 : 0.72;
  const wheels: [number, number, number][] = [
    [-1.5, -0.02, wheelZ],
    [-1.5, -0.02, -wheelZ],
    [1.4, -0.02, wheelZ],
    [1.4, -0.02, -wheelZ],
  ];

  return (
    <group>
      {wheels.map((pos, i) => (
        <Wheel key={i} position={pos} color={color} design={design} />
      ))}
    </group>
  );
}
