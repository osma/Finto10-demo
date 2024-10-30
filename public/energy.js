function setEnergy(newValue) {
  const meter = document.getElementById('meter');
  const currentValue = parseFloat(meter.value);
  const diff = newValue - currentValue;
  const duration = Math.abs(diff) * 10; // Duration in milliseconds

  let startTime = performance.now();
  let elapsedTime = 0;

  function animate(timestamp) {
    elapsedTime = timestamp - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const animatedValue = currentValue + (newValue - currentValue) * progress;

    if (!isNaN(animatedValue)) {
        meter.value = animatedValue;
    }

    if (elapsedTime < duration) {
        requestAnimationFrame(animate);
    } else {
        meter.value = newValue;
    }
  }

  requestAnimationFrame(animate);
}
