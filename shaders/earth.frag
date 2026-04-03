uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform vec3 uSunDirection; // normalized, world space

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vNormal);

  // Diffuse factor: NdotL in view space (sunDirection should be in view space)
  float NdotL = dot(normal, normalize(uSunDirection));

  // Smooth day/night terminator
  float dayMix = smoothstep(-0.3, 0.3, NdotL);

  // Sample textures
  vec4 dayColor   = texture2D(uDay, vUv);
  vec4 nightColor = texture2D(uNight, vUv);
  vec4 cloudSample = texture2D(uClouds, vUv);

  // Cloud mask: white-on-black, use red channel as float mask
  float cloudMask = cloudSample.r;

  // Day surface: blend clouds OVER the land/ocean surface
  vec3 cloudWhite = vec3(1.0);
  vec3 litDay = mix(dayColor.rgb, cloudWhite, cloudMask * 0.85);

  // Ocean specular: dark blue/low saturation pixels = ocean
  // Heuristic: ocean if blue dominant and low red
  float isOcean = clamp((dayColor.b - dayColor.r) * 2.5, 0.0, 1.0);
  float specFactor = isOcean * pow(max(0.0, NdotL), 32.0) * 0.6;
  litDay += vec3(specFactor);

  // Night side: city lights, dimmed under clouds
  vec3 nightLights = nightColor.rgb * (1.0 - cloudMask * 0.7) * 2.0;

  // Combine day and night
  vec3 color = mix(nightLights, litDay, dayMix);

  // Subtle atmospheric rim glow
  vec3 viewDir = normalize(-vPosition);
  float rim = 1.0 - max(0.0, dot(viewDir, normal));
  rim = pow(rim, 3.5);
  vec3 atmoColor = vec3(0.2, 0.5, 1.0);
  color = mix(color, atmoColor, rim * 0.35 * dayMix);
  // Night-side atmospheric glow (dim blue rim)
  color += atmoColor * rim * 0.08 * (1.0 - dayMix);

  gl_FragColor = vec4(color, 1.0);
}
