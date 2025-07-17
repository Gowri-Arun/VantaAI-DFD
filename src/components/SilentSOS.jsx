// src/components/SilentSOS.jsx

import React, { useState, useEffect, useRef } from 'react';
// CORRECTED: Importing 'firestore' for consistency with the rest of the app
import { auth, firestore, storage } from '../firebase-config';
import { signInAnonymously } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';

const SilentSOS = () => {
  const [clickCount, setClickCount] = useState(0);
  const [tempClickCount, setTempClickCount] = useState(0);
  const [uid, setUid] = useState(null);
  const clickTimerRef = useRef(null);
  const tempClickTimerRef = useRef(null);

  // Updated weather data for Kollam, Kerala in July
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
  
  useEffect(() => {
    signInAnonymously(auth)
      .then((userCredential) => {
        setUid(userCredential.user.uid);
        console.log('SOS Component: Signed in anonymously with UID:', userCredential.user.uid);
      })
      .catch((error) => console.error("SOS Component: Anonymous auth failed:", error));
  }, []);

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
      downloadAndDeleteEvidence();
      setTempClickCount(0);
    }
  };

  const triggerSOS = async () => {
    if (!uid) return alert("User not authenticated. Cannot record evidence.");
    
    console.log('🔴 SOS Triggered');
    alert('SOS Triggered. Recording evidence. Please allow all permissions.');

    recordAndUpload({ video: true, audio: true }, 'video', 10000);
    recordAndUpload({ audio: true }, 'audio', 10000);
    
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      recordAndUpload({ video: { mediaSource: 'screen' }, audio: true }, 'screen', 10000);
    } else {
      console.warn('Screen recording not supported on this device.');
    }
  };

  const recordAndUpload = async (constraints, type, duration) => {
    try {
      const stream = await (type === 'screen' 
        ? navigator.mediaDevices.getDisplayMedia(constraints) 
        : navigator.mediaDevices.getUserMedia(constraints));

      if (!stream) return;

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      
      recorder.onstop = async () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: recorder.mimeType });
          const fileName = `${type}-${Date.now()}.webm`;
          const storagePath = `evidence/${uid}/${fileName}`;
          const storageRef = ref(storage, storagePath);

          await uploadBytes(storageRef, blob);
          console.log(`✅ ${type} uploaded successfully.`);

          // CORRECTED: Using 'firestore' instance
          await addDoc(collection(firestore, "evidence"), {
            uid: uid,
            type: type,
            path: storagePath,
            createdAt: serverTimestamp()
          });
        }
        stream.getTracks().forEach((t) => t.stop());
      };
      
      recorder.start();
      setTimeout(() => recorder.state === 'recording' && recorder.stop(), duration);
    } catch (err) {
      console.error(`❌ Failed to record ${type}:`, err.message);
      if (err.name === "NotAllowedError") {
        alert(`Permission denied for ${type}. Please allow camera/microphone access.`);
      }
    }
  };
  
  const downloadAndDeleteEvidence = async () => {
    if (!uid) return alert("User not authenticated.");

    console.log("Fetching evidence from the cloud...");
    // CORRECTED: Using 'firestore' instance
    const evidenceQuery = query(collection(firestore, "evidence"), where("uid", "==", uid));
    const querySnapshot = await getDocs(evidenceQuery);

    if (querySnapshot.empty) {
      return alert("No evidence found in the cloud.");
    }

    alert(`Found ${querySnapshot.size} evidence file(s). They will be downloaded and then permanently deleted.`);

    for (const doc of querySnapshot.docs) {
      const docData = doc.data();
      const filePath = docData.path;
      const fileRef = ref(storage, filePath);

      try {
        const url = await getDownloadURL(fileRef);
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = filePath.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        await deleteObject(fileRef);
        await deleteDoc(doc.ref);
      } catch (error) {
        console.error(`Failed to process file ${filePath}:`, error);
      }
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
          <span onClick={handleTempClick} style={styles.tempText} title="Click 5 times to retrieve & delete evidence">
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
          <button onClick={downloadAndDeleteEvidence} style={styles.button}>
            Retrieve & Delete Evidence
          </button>
      </div>
    </div>
  );
};

// Styles object remains the same
const styles = {
  container: { maxWidth: 400, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif', background: 'linear-gradient(to bottom, #2c3e50, #3498db)', color: 'white', borderRadius: 15, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' },
  header: { textAlign: 'center', marginBottom: 20 },
  main: { background: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: 20, flexGrow: 1 },
  temperature: { fontSize: 48, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 },
  tempText: { fontWeight: 300, cursor: 'pointer', userSelect: 'none' },
  icon: { fontSize: 40, cursor: 'pointer', userSelect: 'none' },
  forecastHeader: { marginTop: 20, marginBottom: 10 },
  forecastItem: { display: 'flex', justifyContent: 'space-between', padding: '5px 0' },
  downloadSection: { marginTop: 20, textAlign: 'center' },
  button: { padding: '12px 20px', background: '#fff', color: '#3498db', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
};

export default SilentSOS;