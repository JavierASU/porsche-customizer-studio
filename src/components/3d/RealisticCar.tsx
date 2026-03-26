import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// ============================================================
// 🔧 MODEL URL — Replace this with your own GLB model URL
// The model should have named meshes/materials for body, wheels, interior
// ============================================================
const MODEL_URL = 'https://threejs.org/examples/models/gltf/ferrari.glb';

interface RealisticCarProps {
  bodyColor: string;
  wheelColor: string;
  interiorColor: string;
  autoRotate: boolean;
  variant: '964' | '993';
}

// Material name patterns to identify car parts
// Adjust these based on your actual model's material/mesh names
const BODY_PATTERNS = ['paint', 'body', 'hood', 'door', 'fender', 'trunk', 'bumper', 'car_paint', 'carpaint', 'exterior'];
const WHEEL_PATTERNS = ['wheel', 'rim', 'tire_rim', 'hubcap', 'alloy'];
const INTERIOR_PATTERNS = ['seat', 'interior', 'leather', 'fabric', 'dashboard_leather', 'upholstery'];
const GLASS_PATTERNS = ['glass', 'window', 'windshield', 'windscreen'];
const CHROME_PATTERNS = ['chrome', 'metal', 'steel', 'aluminium', 'aluminum', 'trim'];

function classifyMaterial(name: string): 'body' | 'wheel' | 'interior' | 'glass' | 'chrome' | 'other' {
  const lower = name.toLowerCase();
  if (BODY_PATTERNS.some(p => lower.includes(p))) return 'body';
  if (WHEEL_PATTERNS.some(p => lower.includes(p))) return 'wheel';
  if (INTERIOR_PATTERNS.some(p => lower.includes(p))) return 'interior';
  if (GLASS_PATTERNS.some(p => lower.includes(p))) return 'glass';
  if (CHROME_PATTERNS.some(p => lower.includes(p))) return 'chrome';
  return 'other';
}

export default function RealisticCar({ bodyColor, wheelColor, interiorColor, autoRotate, variant }: RealisticCarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  // Clone scene so we can modify materials without affecting the cached original
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Clone material so each instance is independent
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map(m => m.clone());
        } else {
          mesh.material = mesh.material.clone();
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  // Apply colors reactively
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        
        materials.forEach((mat) => {
          if (!(mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial)) return;
          
          const name = mat.name || mesh.name || '';
          const type = classifyMaterial(name);
          
          switch (type) {
            case 'body': {
              const physMat = mat as THREE.MeshPhysicalMaterial;
              physMat.color.set(bodyColor);
              physMat.metalness = 0.9;
              physMat.roughness = 0.12;
              physMat.clearcoat = 1.0;
              physMat.clearcoatRoughness = 0.03;
              physMat.envMapIntensity = 2.0;
              physMat.needsUpdate = true;
              break;
            }
            case 'wheel':
              mat.color.set(wheelColor);
              mat.metalness = 0.95;
              mat.roughness = 0.08;
              mat.needsUpdate = true;
              break;
            case 'interior':
              mat.color.set(interiorColor);
              mat.metalness = 0.0;
              mat.roughness = 0.7;
              mat.needsUpdate = true;
              break;
            case 'glass':
              mat.color.set('#111111');
              mat.metalness = 0.0;
              mat.roughness = 0.0;
              if (mat instanceof THREE.MeshPhysicalMaterial) {
                mat.transmission = 0.9;
                mat.transparent = true;
                mat.opacity = 0.3;
              }
              mat.needsUpdate = true;
              break;
            case 'chrome':
              mat.metalness = 1.0;
              mat.roughness = 0.02;
              mat.needsUpdate = true;
              break;
          }
        });
      }
    });
  }, [clonedScene, bodyColor, wheelColor, interiorColor]);

  // Auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Scale and position adjustments based on variant
  const scale = variant === '993' ? 1.05 : 1.0;

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload model
useGLTF.preload(MODEL_URL);
