import React, { useState, useEffect, useRef } from 'react';

// Convert Blob to base64
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (!result) return reject('Empty reader result');
      const base64 = result.split(',')[1];
      base64 ? resolve(base64) : reject('Base64 split failed');
    };
    reader.onerror = (err) => reject('FileReader error: ' + err.message);
    reader.readAsDataURL(blob);
  });

const SilentSOS = () => {
  const [clickCount, setClickCount] = useState(0);
  const [tempClickCount, setTempClickCount] = useState(0);
  const clickTimerRef = useRef(null);
  const tempClickTimerRef = useRef(null);


  const weather = {
    location: 'Kollam, Kerala',
    temperature: 30,
    condition: 'Thunderstorms',
    humidity: 85,
    windSpeed: 15,
    forecast: [
      { day: 'Today', high: 31, low: 26, condition: 'Rainy' },
      { day: 'Tomorrow', high: 30, low: 25, condition: 'Cloudy' },
      { day: 'Saturday', high: 32, low: 26, condition: 'Partly Cloudy' }
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
      handleDownloadAllEvidence();
      setTempClickCount(0);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        triggerSOS();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        handleDownloadAllEvidence();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const triggerSOS = async () => {
    console.log('🔴 SOS Triggered');
    alert('SOS Triggered. Recording evidence for 10 seconds. Please allow all permissions.');
    const recordingPromises = [
      recordMedia({ video: true, audio: true }, 'video', 10000),
      recordMedia({ audio: true }, 'audio', 10000),
    ];
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      recordingPromises.push(recordScreenRecording(10000));
    } else {
      console.warn('Screen recording not supported on this device/browser.');
    }
    await Promise.all(recordingPromises);
    alert('Evidence recording complete and saved locally.');
  };

  const recordMedia = async (constraints, type, duration = 10000) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!stream || stream.getTracks().length === 0) return;
      
      const mimeType = type === 'audio' ? 'audio/webm;codecs=opus' : 'video/webm;codecs=vp8,opus';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      
      recorder.onstop = async () => {
        if (chunks.length > 0) {
          // **FIXED**: Use the recorder's actual mimeType for highest reliability
          const blob = new Blob(chunks, { type: recorder.mimeType });
          try {
            const base64 = await blobToBase64(blob);
            // **FIXED**: Store both the base64 data AND the exact mimeType
            localStorage.setItem(`evidence_${type}`, JSON.stringify({ 
              base64, 
              mimeType: recorder.mimeType 
            }));
            console.log(`✅ ${type} saved with mimeType: ${recorder.mimeType}`);
          } catch (err) {
            console.error(`❌ Failed to process ${type}:`, err);
          }
        }
        stream.getTracks().forEach((t) => t.stop());
      };
      
      recorder.start();
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), Math.max(duration, 5000));
    } catch (err) {
      console.error(`❌ Failed to record ${type}:`, err.message);
      alert(`Access denied for ${type}. Please allow camera/microphone permissions in your browser settings.`);
    }
  };

  const recordScreenRecording = async (duration = 10000) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' }, audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);

      recorder.onstop = async () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: recorder.mimeType });
          try {
            const base64 = await blobToBase64(blob);
            // **FIXED**: Store both the base64 data AND the exact mimeType
            localStorage.setItem(`evidence_screen`, JSON.stringify({
              base64,
              mimeType: recorder.mimeType,
            }));
            console.log(`✅ Screen recording saved with mimeType: ${recorder.mimeType}`);
          } catch (err) {
            console.error('❌ Screen processing failed:', err);
          }
        }
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), duration);
    } catch (err) {
      console.error('❌ Screen recording error:', err.message);
    }
  };

  const handleDownloadAllEvidence = () => {
    let downloadedCount = 0;
    const types = ['video', 'audio', 'screen'];
    types.forEach(type => {
      if (localStorage.getItem(`evidence_${type}`)) {
        downloadEvidence(type);
        downloadedCount++;
      }
    });
    if (downloadedCount === 0) {
      alert('No evidence has been recorded yet. Trigger the SOS first.');
    }
  };

  const downloadEvidence = (type) => {
    try {
      const item = localStorage.getItem(`evidence_${type}`);
      if (!item) return;

      // **FIXED**: Retrieve the full object with both base64 and the reliable mimeType
      const { base64, mimeType } = JSON.parse(item);
      if (!base64 || !mimeType) throw new Error('Stored evidence is invalid.');

      // **FIXED**: Use the stored mimeType directly to construct the download link
      const url = `data:${mimeType};base64,${base64}`;
      const a = document.createElement('a');
      a.href = url;
      
      const fileExtension = mimeType.split(';')[0].split('/')[1] || 'webm';
      a.download = `${type}_evidence_${Date.now()}.${fileExtension}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(`Download error for ${type}:`, err);
      alert(`Could not download ${type} evidence: ${err.message}`);
    }
  };

  const getIcon = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return '☀️';
    if (c.includes('cloud')) return '⛅';
    if (c.includes('rain') || c.includes('storm')) return '🌧️';
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
          <span onClick={handleTempClick} style={styles.tempText} title="Click 5 times to download evidence">
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
      <div style={styles.downloadSection}>
          <button onClick={handleDownloadAllEvidence} style={styles.button}>
            Download Weather Report
          </button>
      </div>
    </div>
  );
};

// ... (styles object remains the same)
const styles = {
  container: { maxWidth: 400, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif', background: 'linear-gradient(to bottom, #74b9ff, #0984e3)', color: 'white', borderRadius: 15, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' },
  header: { textAlign: 'center', marginBottom: 20 },
  main: { background: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: 20, flexGrow: 1 },
  temperature: { fontSize: 48, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 },
  tempText: { fontWeight: 300, cursor: 'pointer', userSelect: 'none' },
  icon: { fontSize: 40, cursor: 'pointer', userSelect: 'none' },
  forecastHeader: { marginTop: 20, marginBottom: 10 },
  forecastItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 0' },
  downloadSection: { marginTop: 20, textAlign: 'center' },
  button: { padding: '12px 20px', background: '#fff', color: '#0984e3', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
};

export default SilentSOS;