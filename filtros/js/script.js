let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let image = new Image();
let currentFilter = null;

let originalWidth = 0;
let originalHeight = 0;

const upload = document.getElementById("upload");
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function (event) {
    image.onload = function () {
      originalWidth = image.width;
      originalHeight = image.height;

      canvas.width = originalWidth;
      canvas.height = originalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

function updateSliderValue(sliderId, displayId) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);

  let value = slider.value;

  if (sliderId === 'slider') {
    value = Math.round(value * 100);
  } if (sliderId === 'thresholdSlider') {
    value = Math.round((value / 255) * 100);
  }else if (sliderId === 'glowSlider') {
  value = Math.round(value * 100);
  }

  display.textContent = value;
}

function selectFilter(filterName) {
  currentFilter = filterName;
  
  // Показываем/скрываем элементы интерфейса в зависимости от фильтра
  const charSelector = document.getElementById("charSelector");
  const invertCheckbox = document.getElementById("invertCheckbox").parentElement;
  const thresholdSlider = document.getElementById("thresholdSlider").parentElement;
  
  if (filterName === 'asciiDither') {
    charSelector.style.display = 'block';
    invertCheckbox.style.display = 'block';
    thresholdSlider.style.display = 'block';
  } else {
    charSelector.style.display = 'none';
    invertCheckbox.style.display = 'block';
    thresholdSlider.style.display = 'block';
  }
  
  const slider = document.getElementById("slider");
  applyFilter(filterName, parseFloat(slider.value));
}

function applyFilter(filterName, filterValue) {
  if (!image.src) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filterName) {
    case 'asciiDither':
      applyAsciiDither(data, filterValue);
      break;
    case 'dotMatrix':
      applyDotMatrix(data, filterValue);
      break;
    case 'braille':
      applyBraille(data, filterValue);
      break;
    case 'blockArt':
      applyBlockArt(data, filterValue);
      break;
    case 'lineArt':
      applyLineArt(data, filterValue);
      break;
    case 'crosshatch':
      applyCrosshatch(data, filterValue);
      break;
  }
  const glowAmount = parseFloat(document.getElementById("glowSlider")?.value || "0");

  if (glowAmount > 0) {
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = canvas.width;
    glowCanvas.height = canvas.height;
    const glowCtx = glowCanvas.getContext("2d");

    glowCtx.drawImage(canvas, 0, 0);
    glowCtx.globalCompositeOperation = "source-in";
    glowCtx.filter = `blur(${mapRange(glowAmount, 0, 1, 5, 40)}px)`;
    glowCtx.drawImage(canvas, 0, 0);

    ctx.globalAlpha = glowAmount;
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(glowCanvas, 0, 0);

    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
  }
}

function applyAsciiDither(data, filterValue) {
  const selectedChar = document.getElementById("asciiChar")?.value || '@';
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);

  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 12, 4));

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${cellSize}px monospace`;
  ctx.textBaseline = 'top';

  for (let y = 0; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      const thresholdNorm = threshold / 255;
      const distance = Math.abs(brightness - thresholdNorm);
      const smoothAlpha = Math.max(0, 1 - distance * 5);

      let drawSymbol = false;
      if (inverted) {
        drawSymbol = brightness < thresholdNorm;
      } else {
        drawSymbol = brightness > thresholdNorm;
      }

      if (drawSymbol && smoothAlpha > 0.05) {
        ctx.fillStyle = `rgba(255,255,255,${smoothAlpha})`;
        ctx.fillText(selectedChar, x, y);
      }
    }
  }
}

function applyDotMatrix(data, filterValue) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 16, 6));

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let drawDot = (!inverted && brightness > threshold) || (inverted && brightness < threshold);

      if (drawDot) {
        const alpha = brightness / 255;
        const radius = Math.max(1, (cellSize * 0.4) * alpha);
        
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x + cellSize/2, y + cellSize/2, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function applyBraille(data, filterValue) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 12, 6));
  
  // Брайлевские символы (Unicode Braille Patterns)
  const brailleChars = ['⠀','⠁','⠂','⠃','⠄','⠅','⠆','⠇','⠈','⠉','⠊','⠋','⠌','⠍','⠎','⠏',
                       '⠐','⠑','⠒','⠓','⠔','⠕','⠖','⠗','⠘','⠙','⠚','⠛','⠜','⠝','⠞','⠟',
                       '⠠','⠡','⠢','⠣','⠤','⠥','⠦','⠧','⠨','⠩','⠪','⠫','⠬','⠭','⠮','⠯',
                       '⠰','⠱','⠲','⠳','⠴','⠵','⠶','⠷','⠸','⠹','⠺','⠻','⠼','⠽','⠾','⠿'];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${cellSize}px monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';

  for (let y = 0; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let drawChar = (!inverted && brightness > threshold) || (inverted && brightness < threshold);

      if (drawChar) {
        const charIndex = Math.floor((brightness / 255) * (brailleChars.length - 1));
        ctx.fillText(brailleChars[charIndex], x, y);
      }
    }
  }
}

function applyBlockArt(data, filterValue) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 12, 4));
  
  const blockChars = ['░', '▒', '▓', '█'];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${cellSize}px monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';

  for (let y = 0; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let effectiveBrightness = inverted ? 255 - brightness : brightness;
      
      if (effectiveBrightness > threshold) {
        const charIndex = Math.floor((effectiveBrightness / 255) * (blockChars.length - 1));
        ctx.fillText(blockChars[charIndex], x, y);
      }
    }
  }
}

function applyLineArt(data, filterValue) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 12, 4));
  
  const lineChars = ['─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', '╱', '╲', '╳'];

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${cellSize}px monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';

  for (let y = 0; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let drawChar = (!inverted && brightness > threshold) || (inverted && brightness < threshold);

      if (drawChar) {
        const charIndex = Math.floor((brightness / 255) * (lineChars.length - 1));
        const alpha = Math.max(0.3, brightness / 255);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillText(lineChars[charIndex], x, y);
      }
    }
  }
}

function applyCrosshatch(data, filterValue) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 16, 6));

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;

  for (let y = 0; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let drawLines = (!inverted && brightness > threshold) || (inverted && brightness < threshold);

      if (drawLines) {
        const alpha = brightness / 255;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        
        // Рисуем линии в зависимости от яркости
        ctx.beginPath();
        if (brightness > 200) {
          // Горизонтальные и вертикальные линии
          ctx.moveTo(x, y + cellSize/2);
          ctx.lineTo(x + cellSize, y + cellSize/2);
          ctx.moveTo(x + cellSize/2, y);
          ctx.lineTo(x + cellSize/2, y + cellSize);
        } else if (brightness > 150) {
          // Диагональные линии
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x, y + cellSize);
        } else {
          // Одна диагональная линия
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y + cellSize);
        }
        ctx.stroke();
      }
    }
  }
}

// Исправленная функция скачивания
function downloadFilteredOriginal() {
  if (!image.src || !currentFilter) {
    alert('Загрузите изображение и примените фильтр');
    return;
  }

  // Создаем временный холст с размерами оригинального изображения
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = originalWidth;
  tempCanvas.height = originalHeight;
  const tempCtx = tempCanvas.getContext("2d");

  // Рисуем оригинальное изображение для получения данных пикселей
  tempCtx.drawImage(image, 0, 0, originalWidth, originalHeight);
  const imageData = tempCtx.getImageData(0, 0, originalWidth, originalHeight);
  const data = imageData.data;

  // Получаем текущие настройки
  const sliderValue = parseFloat(document.getElementById("slider").value);
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const glowAmount = parseFloat(document.getElementById("glowSlider")?.value || "0");

  // Применяем соответствующий фильтр
  switch (currentFilter) {
    case 'asciiDither':
      applyAsciiDitherToCanvas(tempCtx, data, sliderValue, originalWidth, originalHeight);
      break;
    case 'dotMatrix':
      applyDotMatrixToCanvas(tempCtx, data, sliderValue, originalWidth, originalHeight);
      break;
    case 'braille':
      applyBrailleToCanvas(tempCtx, data, sliderValue, originalWidth, originalHeight);
      break;
    case 'blockArt':
      applyBlockArtToCanvas(tempCtx, data, sliderValue, originalWidth, originalHeight);
      break;
    case 'lineArt':
      applyLineArtToCanvas(tempCtx, data, sliderValue, originalWidth, originalHeight);
      break;
    case 'crosshatch':
      applyCrosshatchToCanvas(tempCtx, data, sliderValue, originalWidth, originalHeight);
      break;
  }

  // Применяем эффект свечения, если включен
  if (glowAmount > 0) {
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = originalWidth;
    glowCanvas.height = originalHeight;
    const glowCtx = glowCanvas.getContext("2d");

    glowCtx.drawImage(tempCanvas, 0, 0);
    glowCtx.globalCompositeOperation = "source-in";
    glowCtx.filter = `blur(${mapRange(glowAmount, 0, 1, 5, 40)}px)`;
    glowCtx.drawImage(tempCanvas, 0, 0);

    tempCtx.globalAlpha = glowAmount;
    tempCtx.globalCompositeOperation = "lighter";
    tempCtx.drawImage(glowCanvas, 0, 0);

    tempCtx.globalAlpha = 1.0;
    tempCtx.globalCompositeOperation = "source-over";
  }

  // Скачиваем результат
  tempCanvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentFilter}-filtered-image.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

// Вспомогательные функции для применения фильтров на временном холсте
function applyAsciiDitherToCanvas(ctx, data, filterValue, width, height) {
  const selectedChar = document.getElementById("asciiChar")?.value || '@';
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 12, 4));

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${cellSize}px monospace`;
  ctx.textBaseline = 'top';

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      const thresholdNorm = threshold / 255;
      const distance = Math.abs(brightness - thresholdNorm);
      const smoothAlpha = Math.max(0, 1 - distance * 5);

      let drawSymbol = false;
      if (inverted) {
        drawSymbol = brightness < thresholdNorm;
      } else {
        drawSymbol = brightness > thresholdNorm;
      }

      if (drawSymbol && smoothAlpha > 0.05) {
        ctx.fillStyle = `rgba(255,255,255,${smoothAlpha})`;
        ctx.fillText(selectedChar, x, y);
      }
    }
  }
}

function applyDotMatrixToCanvas(ctx, data, filterValue, width, height) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 16, 6));

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let drawDot = (!inverted && brightness > threshold) || (inverted && brightness < threshold);

      if (drawDot) {
        const alpha = brightness / 255;
        const radius = Math.max(1, (cellSize * 0.4) * alpha);
        
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x + cellSize/2, y + cellSize/2, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function applyBrailleToCanvas(ctx, data, filterValue, width, height) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 12, 6));
  
  const brailleChars = ['⠀','⠁','⠂','⠃','⠄','⠅','⠆','⠇','⠈','⠉','⠊','⠋','⠌','⠍','⠎','⠏',
                       '⠐','⠑','⠒','⠓','⠔','⠕','⠖','⠗','⠘','⠙','⠚','⠛','⠜','⠝','⠞','⠟',
                       '⠠','⠡','⠢','⠣','⠤','⠥','⠦','⠧','⠨','⠩','⠪','⠫','⠬','⠭','⠮','⠯',
                       '⠰','⠱','⠲','⠳','⠴','⠵','⠶','⠷','⠸','⠹','⠺','⠻','⠼','⠽','⠾','⠿'];

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${cellSize}px monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let drawChar = (!inverted && brightness > threshold) || (inverted && brightness < threshold);

      if (drawChar) {
        const charIndex = Math.floor((brightness / 255) * (brailleChars.length - 1));
        ctx.fillText(brailleChars[charIndex], x, y);
      }
    }
  }
}

function applyBlockArtToCanvas(ctx, data, filterValue, width, height) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 12, 4));
  
  const blockChars = ['░', '▒', '▓', '█'];

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${cellSize}px monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let effectiveBrightness = inverted ? 255 - brightness : brightness;
      
      if (effectiveBrightness > threshold) {
        const charIndex = Math.floor((effectiveBrightness / 255) * (blockChars.length - 1));
        ctx.fillText(blockChars[charIndex], x, y);
      }
    }
  }
}

function applyLineArtToCanvas(ctx, data, filterValue, width, height) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 12, 4));
  
  const lineChars = ['─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', '╱', '╲', '╳'];

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `${cellSize}px monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#fff';

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let drawChar = (!inverted && brightness > threshold) || (inverted && brightness < threshold);

      if (drawChar) {
        const charIndex = Math.floor((brightness / 255) * (lineChars.length - 1));
        const alpha = Math.max(0.3, brightness / 255);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillText(lineChars[charIndex], x, y);
      }
    }
  }
}

function applyCrosshatchToCanvas(ctx, data, filterValue, width, height) {
  const inverted = document.getElementById("invertCheckbox")?.checked;
  const threshold = parseInt(document.getElementById("thresholdSlider").value);
  const cellSize = Math.floor(mapRange(filterValue, 0, 1, 16, 6));

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;

  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

      let drawLines = (!inverted && brightness > threshold) || (inverted && brightness < threshold);

      if (drawLines) {
        const alpha = brightness / 255;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        
        ctx.beginPath();
        if (brightness > 200) {
          ctx.moveTo(x, y + cellSize/2);
          ctx.lineTo(x + cellSize, y + cellSize/2);
          ctx.moveTo(x + cellSize/2, y);
          ctx.lineTo(x + cellSize/2, y + cellSize);
        } else if (brightness > 150) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x, y + cellSize);
        } else {
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y + cellSize);
        }
        ctx.stroke();
      }
    }
  }
}

window.onload = function() {
  updateSliderValue('slider', 'sliderValue');
  updateSliderValue('thresholdSlider', 'thresholdValue');

  const btn = document.getElementById("downloadBtn");
  if (btn) {
    btn.addEventListener("click", downloadFilteredOriginal);
  }
};