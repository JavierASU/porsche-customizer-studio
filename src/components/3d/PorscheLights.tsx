interface LightsProps {
  variant: '964' | '993';
}

export function Headlights({ variant }: LightsProps) {
  const z = variant === '964' ? 0.42 : 0.5;
  const r = variant === '964' ? 0.12 : 0.09;
  const x = variant === '964' ? -2.08 : -2.18;
  const y = variant === '964' ? 0.52 : 0.48;
  return (
    <group>
      {[z, -z].map((pz, i) => (
        <group key={i} position={[x, y, pz]}>
          <mesh>
            <sphereGeometry args={[r, 24, 24, 0, Math.PI * 0.6]} />
            <meshPhysicalMaterial
              color="#ffffff" emissive="#ffffcc" emissiveIntensity={0.2}
              transparent opacity={0.85} roughness={0} transmission={0.3} clearcoat={1}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[r, 0.012, 12, 36]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={1} roughness={0.02} />
          </mesh>
          {/* Inner reflector */}
          <mesh position={[0.02, 0, 0]}>
            <sphereGeometry args={[r * 0.5, 16, 16]} />
            <meshPhysicalMaterial color="#e0e0e0" metalness={0.95} roughness={0.05} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function TailLights({ variant }: LightsProps) {
  const x = variant === '964' ? 2.18 : 2.28;
  const y = variant === '964' ? 0.42 : 0.38;
  const width = variant === '993' ? 0.28 : 0.2;
  return (
    <group>
      {[0.48, -0.48].map((pz, i) => (
        <group key={i} position={[x, y, pz]}>
          <mesh castShadow>
            <boxGeometry args={[0.04, 0.08, width]} />
            <meshPhysicalMaterial
              color="#cc0000" emissive="#ff0000" emissiveIntensity={0.5}
              roughness={0.15} clearcoat={1}
            />
          </mesh>
          {/* Chrome surround */}
          <mesh position={[0.005, 0, 0]}>
            <boxGeometry args={[0.005, 0.09, width + 0.01]} />
            <meshPhysicalMaterial color="#d0d0d0" metalness={1} roughness={0.02} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
