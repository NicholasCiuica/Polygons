function vectorNormalize(v) {
  const magnitude = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  if(magnitude == 0) {
      return {x: 0, y: 0, z: 0};
  }
  return {
      x: v.x / magnitude,
      y: v.y / magnitude,
      z: v.z / magnitude
  }
}

function vectorSubtract(v1, v2) {
  return {
      x: v1.x - v2.x,
      y: v1.y - v2.y,
      z: v1.z - v2.z
  };
}

function vectorScalarMultiply(v, c) {
  return {
      x: v.x * c,
      y: v.y * c,
      z: v.z * c
  }
}

function vectorDotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function vectorCrossProduct(v1, v2) {
  return {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
  };
}