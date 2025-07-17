// src/components/SilentSOS.jsx

import React, { useState, useEffect, useRef } from 'react';

const SilentSOS = () => {
  const [clickCount, setClickCount] = useState(0);
  const [tempClickCount, setTempClickCount] = useState(0);
  const clickTimerRef = useRef(null);
  const tempClickTimerRef = useRef(null);

  const weather = {
    location: 'Kollam, Kerala',
    temperature: 28,
    condition: 'Heavy Rain & Thunder',
    humidity: 88,
    windSpeed: 18,
    forecast: [
      { day: 'Today', high: 29, low: 25, condition: 'Rainy' },
      { day: 'Tomorrow', high: 29, low: 25, condition: 'Showers' },
      { day: 'Saturday', high: 30, low: 26, condition: 'Cloudy' }
    ]
  };

  const handleCloudClick = () => {
    setClickCount((prev) => prev + 1);
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => setClickCount(0), 3000);
    if (clickCount + 1 >= 3) {
      triggerSOS();
      setClickCount(0);
    }
  };
  
  const handleTempClick = () => {
    setTempClickCount((prev) => prev + 1);
    clearTimeout(tempClickTimerRef.current);
    tempClickTimerRef.current = setTimeout(() => setTempClickCount(0), 3000);
    if (tempClickCount + 1 >= 5) {
      triggerSOS();
      setTempClickCount(0);
    }
  };
  
  // This function now uploads a file to file.io and returns the link
  const uploadToFileIO = async (blob, type) => {
    const formData = new FormData();
    const fileName = `${type}-${Date.now()}.webm`;
    formData.append('file', blob, fileName);

    try {
      console.log(`Uploading ${type} to file.io...`);
      const response = await fetch('https://file.io', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ ${type} uploaded successfully: ${result.link}`);
        return result.link;
      } else {
        console.error(`❌ Failed to upload ${type}:`, result);
        return null;
      }
    } catch (error) {
      console.error(`❌ Network error uploading ${type}:`, error);
      return null;
    }
  };
  
  const recordAndUpload = async (constraints, type, duration) => {
    try {
      const stream = await (type === 'screen' 
        ? navigator.mediaDevices.getDisplayMedia(constraints) 
        : navigator.mediaDevices.getUserMedia(constraints));

      if (!stream) return null;

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      
      const uploadPromise = new Promise((resolve) => {
        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: recorder.mimeType });
            const link = await uploadToFileIO(blob, type);
            resolve(link);
          } else {
            resolve(null);
          }
        };
      });
      
      recorder.start();
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), duration);
      return uploadPromise;

    } catch (err) {
      console.error(`❌ Failed to record ${type}:`, err.message);
      if (err.name === "NotAllowedError") {
        alert(`Permission denied for ${type}. Please allow camera/microphone access.`);
      }
      return null;
    }
  };

  const triggerSOS = async () => {
    console.log('🔴 SOS Triggered');
    alert('SOS Triggered. Recording evidence and uploading. Please allow all permissions.');

    const uploadPromises = [];
    uploadPromises.push(recordAndUpload({ video: true, audio: true }, 'video', 10000));
    uploadPromises.push(recordAndUpload({ audio: true }, 'audio', 10000));
    
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      uploadPromises.push(recordAndUpload({ video: { mediaSource: 'screen' }, audio: true }, 'screen', 10000));
    } else {
      console.warn('Screen recording not supported on this device.');
    }

    // Wait for all uploads to complete
    const links = await Promise.all(uploadPromises);
    const successfulLinks = links.filter(link => link !== null); // Filter out any failed uploads

    if (successfulLinks.length > 0) {
      // Show the user all the successful links in one alert
      alert(
        'Evidence Uploaded Successfully!\n\n' + 
        'These links will expire after one view or 14 days. Copy them now:\n\n' + 
        successfulLinks.join('\n')
      );
    } else {
      alert('Evidence recording failed. Please check the console for errors and make sure you have a working camera/microphone.');
    }
  };

  const getIcon = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return '☀️';
    if (c.includes('cloud')) return '⛅';
    if (c.includes('rain') || c.includes('storm') || c.includes('showers')) return '🌧️';
    return '☁️';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>WeatherNow</h2>
        <div>{weather.location}</div>
      </div>
      <div style={styles.main}>
        <div style={styles.temperature}>
          <span onClick={handleTempClick} style={styles.tempText} title="Click 5 times for SOS">
            {weather.temperature}°C
          </span>
          <span onClick={handleCloudClick} style={styles.icon} title="Click 3 times for SOS">
            {getIcon(weather.condition)}
          </span>
        </div>
        <div>{weather.condition}</div>
        <div>Humidity: {weather.humidity}% | Wind: {weather.windSpeed} km/h</div>
        <h4 style={styles.forecastHeader}>Forecast</h4>
        {weather.forecast.map((f, i) => (
          <div key={i} style={styles.forecastItem}>
            <span>{f.day}:</span>
            <span>{getIcon(f.condition)} {f.high}° / {f.low}°</span>
          </div>
        ))}
      </div>
      {/* The download button has been removed as links are now provided in an alert */}
    </div>
  );
};

const styles = {
  container: { maxWidth: 400, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif', background: 'linear-gradient(to bottom, #2c3e50, #3498db)', color: 'white', borderRadius: 15, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' },
  header: { textAlign: 'center', marginBottom: 20 },
  main: { background: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: 20, flexGrow: 1 },
  temperature: { fontSize: 48, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 },
  tempText: { fontWeight: 300, cursor: 'pointer', userSelect: 'none' },
  icon: { fontSize: 40, cursor: 'pointer', userSelect: 'none' },
  forecastHeader: { marginTop: 20, marginBottom: 10 },
  forecastItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 0' },
};

export default SilentSOS;