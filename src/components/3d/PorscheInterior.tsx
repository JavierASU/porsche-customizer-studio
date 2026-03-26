interface InteriorProps {
  color: string;
}

export default function PorscheInterior({ color }: InteriorProps) {
  return (
    <group>
      {/* Seats */}
      {[0.2, -0.2].map((pz, i) => (
        <group key={i} position={[0.15, 0.36, pz]}>
          <mesh>
            <boxGeometry args={[0.32, 0.06, 0.22]} />
            <meshPhysicalMaterial color={color} roughness={0.6} metalness={0} clearcoat={0.3} />
          </mesh>
          <mesh position={[-0.06, 0.16, 0]}>
            <boxGeometry args={[0.06, 0.26, 0.2]} />
            <meshPhysicalMaterial color={color} roughness={0.6} metalness={0} clearcoat={0.3} />
          </mesh>
          <mesh position={[-0.06, 0.32, 0]}>
            <boxGeometry args={[0.05, 0.08, 0.12]} />
            <meshPhysicalMaterial color={color} roughness={0.65} metalness={0} />
          </mesh>
          {/* Seat bolster detail */}
          {[-0.09, 0.09].map((bz, j) => (
            <mesh key={j} position={[-0.06, 0.12, bz]}>
              <boxGeometry args={[0.055, 0.2, 0.02]} />
              <meshPhysicalMaterial color={color} roughness={0.55} metalness={0} clearcoat={0.3} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Dashboard */}
      <mesh position={[-0.35, 0.42, 0]}>
        <boxGeometry args={[0.12, 0.08, 1.0]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Instrument cluster */}
      <mesh position={[-0.3, 0.46, 0.24]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 20]} />
        <meshPhysicalMaterial color="#111" roughness={0.3} metalness={0.4} emissive="#00ff00" emissiveIntensity={0.05} />
      </mesh>
      {/* Steering wheel */}
      <mesh position={[-0.26, 0.5, 0.24]} rotation={[0.35, 0, 0]}>
        <torusGeometry args={[0.075, 0.012, 16, 32]} />
        <meshStandardMaterial color="#111" roughness={0.45} metalness={0.2} />
      </mesh>
      {/* Steering column */}
      <mesh position={[-0.31, 0.46, 0.24]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.12, 12]} />
        <meshStandardMaterial color="#222" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Center console */}
      <mesh position={[0.0, 0.32, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} />
      </mesh>
      {/* Gear shifter */}
      <mesh position={[-0.05, 0.36, 0]}>
        <cylinderGeometry args={[0.015, 0.012, 0.06, 12]} />
        <meshPhysicalMaterial color="#222" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}
