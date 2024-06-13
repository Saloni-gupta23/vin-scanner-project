import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import './App.css';

const App = () => {
  const [vin, setVin] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const webcamRef = useRef(null);
  const barcodeReader = new BrowserMultiFormatReader();

  const handleScan = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const result = await barcodeReader.decodeFromImage(undefined, imageSrc);
        if (result) {
          setVin(result.text);
          setShowScanner(false);
        }
      } catch (err) {
        console.log('Barcode not detected:', err);
      }
    }
  };

  useEffect(() => {
    if (showScanner) {
      const interval = setInterval(handleScan, 500);
      return () => clearInterval(interval);
    }
  }, [showScanner]);

  const clearVin = () => {
    setVin('');
  };

  const verifyVin = () => {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (vinRegex.test(vin)) {
      alert('Valid VIN');
    } else {
      alert('Invalid VIN');
    }
  };

  return (
    <div className="app">
      <header className="header">
        QR and Bar Code Scanner
      </header>
      <div className="content">
        <label className="label">Vehicle Identification Number</label>
        <div className="input-container">
          <input 
            type="text"
            className="input-field"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            maxLength="17"
            placeholder="Enter 17-Digit VIN Number"
          />
          <button className="camera-button" onClick={() => setShowScanner(!showScanner)}>
            <img src="/camera-icon.png" alt="camera icon" />
          </button>
        </div>
        {showScanner && (
          <div className="scanner-container">
            <Webcam 
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height="100%"
              className="webcam"
            />
            <div className="scanner-overlay">
              <div className="scanner-target"></div>
            </div>
          </div>
        )}
        <div className="buttons">
          <button className="clear-button" onClick={clearVin}>Clear</button>
          <button className="verify-button" onClick={verifyVin}>Verify</button>
        </div>
      </div>
    </div>
  );
};

export default App;
