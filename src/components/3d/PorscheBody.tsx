import { useMemo } from 'react';
import * as THREE from 'three';

interface PorscheBodyProps {
  variant: '964' | '993';
  bodyColor: string;
}

/* ─── 964 body: upright classic ─── */
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

/* ─── 993 body: wider, lower, smoother ─── */
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

export default function PorscheBody({ variant, bodyColor }: PorscheBodyProps) {
  const bodyGeo = useMemo(() => {
    const g = variant === '964' ? createBody964() : createBody993();
    g.center();
    return g;
  }, [variant]);

  const is993 = variant === '993';

  return (
    <group>
      {/* Main body shell */}
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={bodyColor}
          metalness={0.92}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={3.5}
          reflectivity={1}
        />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.1, 0.62, 0]} rotation={[0, 0, -0.38]} castShadow>
        <boxGeometry args={[0.65, 0.015, is993 ? 1.3 : 1.15]} />
        <meshPhysicalMaterial
          color="#0a0a0a" metalness={0.1} roughness={0}
          transparent opacity={0.25} transmission={0.8} clearcoat={1}
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[0.88, 0.58, 0]} rotation={[0, 0, 0.42]}>
        <boxGeometry args={[0.5, 0.015, is993 ? 1.1 : 0.95]} />
        <meshPhysicalMaterial
          color="#0a0a0a" metalness={0.1} roughness={0}
          transparent opacity={0.25} transmission={0.8} clearcoat={1}
        />
      </mesh>

      {/* Side windows */}
      {[1, -1].map((side) => (
        <mesh key={side} position={[0.45, 0.62, side * (is993 ? 0.78 : 0.71)]} rotation={[side * 0.08, 0, 0]}>
          <boxGeometry args={[0.8, 0.22, 0.012]} />
          <meshPhysicalMaterial
            color="#0a0a0a" transparent opacity={0.2}
            transmission={0.8} roughness={0} clearcoat={1}
          />
        </mesh>
      ))}

      {/* Chrome trim line */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4.4, 0.008, is993 ? 1.72 : 1.57]} />
        <meshPhysicalMaterial color="#d0d0d0" metalness={1} roughness={0.02} />
      </mesh>

      {/* Front bumper */}
      <mesh position={[-2.2, 0.28, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, is993 ? 1.5 : 1.35]} />
        <meshPhysicalMaterial
          color={bodyColor} metalness={0.92} roughness={0.28}
          clearcoat={1} clearcoatRoughness={0.03} envMapIntensity={3.5}
        />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[2.25, 0.28, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, is993 ? 1.5 : 1.35]} />
        <meshPhysicalMaterial
          color={bodyColor} metalness={0.92} roughness={0.28}
          clearcoat={1} clearcoatRoughness={0.03} envMapIntensity={3.5}
        />
      </mesh>

      {/* Door lines */}
      {[1, -1].map(side => (
        <mesh key={side} position={[-0.1, 0.48, side * (is993 ? 0.79 : 0.72)]}>
          <boxGeometry args={[1.2, 0.3, 0.005]} />
          <meshPhysicalMaterial
            color={bodyColor} metalness={0.92} roughness={0.28}
            clearcoat={1} envMapIntensity={3.5}
          />
        </mesh>
      ))}

      {/* Side mirrors */}
      {[1, -1].map(side => (
        <group key={`mirror-${side}`} position={[-0.4, 0.65, side * (is993 ? 0.82 : 0.75)]}>
          <mesh>
            <boxGeometry args={[0.08, 0.05, 0.06]} />
            <meshPhysicalMaterial color={bodyColor} metalness={0.92} roughness={0.28} clearcoat={1} envMapIntensity={3.5} />
          </mesh>
          <mesh position={[-0.045, 0, 0]}>
            <boxGeometry args={[0.005, 0.04, 0.05]} />
            <meshPhysicalMaterial color="#222" metalness={0.5} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Front air intake */}
      <mesh position={[-2.28, 0.22, 0]}>
        <boxGeometry args={[0.04, 0.06, is993 ? 0.8 : 0.6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Rear spoiler */}
      {is993 && (
        <group position={[1.9, 0.72, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.018, 1.2]} />
            <meshPhysicalMaterial color={bodyColor} metalness={0.92} roughness={0.28} clearcoat={1} envMapIntensity={3.5} />
          </mesh>
          {/* Spoiler supports */}
          {[0.35, -0.35].map((pz, i) => (
            <mesh key={i} position={[0.05, -0.04, pz]}>
              <boxGeometry args={[0.03, 0.06, 0.03]} />
              <meshPhysicalMaterial color={bodyColor} metalness={0.88} roughness={0.08} clearcoat={1} />
            </mesh>
          ))}
        </group>
      )}

      {/* 964 whale tail */}
      {!is993 && (
        <mesh position={[1.85, 0.68, 0]} castShadow>
          <boxGeometry args={[0.15, 0.012, 1.0]} />
          <meshPhysicalMaterial color={bodyColor} metalness={0.92} roughness={0.28} clearcoat={1} envMapIntensity={3.5} />
        </mesh>
      )}

      {/* Exhaust tips */}
      {(is993 ? [0.25, -0.25] : [0.18, -0.18]).map((pz, i) => (
        <mesh key={i} position={[2.35, 0.2, pz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.035, 0.08, 16]} />
          <meshPhysicalMaterial color="#888" metalness={1} roughness={0.05} />
        </mesh>
      ))}

      {/* Door handles */}
      {[1, -1].map(side => (
        <mesh key={`handle-${side}`} position={[-0.3, 0.55, side * (is993 ? 0.795 : 0.725)]}>
          <boxGeometry args={[0.1, 0.015, 0.012]} />
          <meshPhysicalMaterial color="#c0c0c0" metalness={1} roughness={0.05} />
        </mesh>
      ))}
    </group>
  );
}
