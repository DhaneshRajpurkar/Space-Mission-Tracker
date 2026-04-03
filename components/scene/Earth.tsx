'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, Mesh, Vector3, ShaderMaterial } from 'three';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform vec3 uSunDirection;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vNormal);

  float NdotL = dot(normal, normalize(uSunDirection));
  float dayMix = smoothstep(-0.3, 0.3, NdotL);

  vec4 dayColor    = texture2D(uDay, vUv);
  vec4 nightColor  = texture2D(uNight, vUv);
  vec4 cloudSample = texture2D(uClouds, vUv);

  float cloudMask = cloudSample.r;

  // Clouds mixed OVER surface, not added
  vec3 cloudWhite = vec3(1.0);
  vec3 litDay = mix(dayColor.rgb, cloudWhite, cloudMask * 0.85);

  // Ocean specular
  float isOcean = clamp((dayColor.b - dayColor.r) * 2.5, 0.0, 1.0);
  float specFactor = isOcean * pow(max(0.0, NdotL), 32.0) * 0.6;
  litDay += vec3(specFactor);

  // Night city lights — dimmed under clouds
  vec3 nightLights = nightColor.rgb * (1.0 - cloudMask * 0.7) * 2.0;

  vec3 color = mix(nightLights, litDay, dayMix);

  // Atmospheric rim
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - max(0.0, dot(viewDir, normal));
  rim = pow(rim, 3.5);
  vec3 atmoColor = vec3(0.2, 0.5, 1.0);
  color = mix(color, atmoColor, rim * 0.35 * dayMix);
  color += atmoColor * rim * 0.08 * (1.0 - dayMix);

  gl_FragColor = vec4(color, 1.0);
}
`;

interface EarthProps {
  onFocus?: () => void;
}

export default function Earth({ onFocus }: EarthProps) {
  const meshRef = useRef<Mesh>(null!);
  const matRef = useRef<ShaderMaterial>(null!);
  const { scene, camera } = useThree();

  const [dayMap, nightMap, cloudsMap] = useLoader(TextureLoader, [
    '/textures/earth_day.jpg',
    '/textures/earth_night.jpg',
    '/textures/earth_clouds.jpg',
  ]);

  // Sun direction in view space, updated each frame
  const sunWorldPos = useMemo(() => new Vector3(800, 200, 0), []);
  const sunViewDir = useMemo(() => new Vector3(), []);

  const uniforms = useMemo(
    () => ({
      uDay:          { value: dayMap },
      uNight:        { value: nightMap },
      uClouds:       { value: cloudsMap },
      uSunDirection: { value: new Vector3(1, 0, 0) },
    }),
    [dayMap, nightMap, cloudsMap]
  );

  useFrame(() => {
    if (!matRef.current) return;
    // Transform sun direction to view space
    sunViewDir.copy(sunWorldPos).sub(meshRef.current.position);
    sunViewDir.transformDirection(camera.matrixWorldInverse);
    matRef.current.uniforms.uSunDirection.value.copy(sunViewDir);

    // Slow Earth rotation
    meshRef.current.rotation.y += 0.0003;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} onClick={onFocus}>
      <sphereGeometry args={[3, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
