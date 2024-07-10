import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import './App.css';

const App = () => {
  const [vin, setVin] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (showScanner) {
      startScanner();
    } else {
      codeReader.current.reset();
    }
    return () => {
      codeReader.current.reset();
    };
  }, [showScanner]);

  const startScanner = () => {
    if (scannerRef.current) {
      setIsScanning(true);
      codeReader.current.decodeFromVideoDevice(null, scannerRef.current, (result, err) => {
        if (result) {
          let scannedVin = result.getText().trim().replace(/[^A-HJ-NPR-Z0-9]/g, ''); // Clean the scanned VIN
          if (scannedVin.length > 17) {
            scannedVin = scannedVin.substring(0, 17); // Ensure it is not longer than 17 characters
          }
          setVin(scannedVin);
          setShowScanner(false);
          setIsScanning(false);
          codeReader.current.reset();
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      });
    }
  };

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

  const handleVinChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ''); // Clean the input value
    setVin(value.substring(0, 17)); // Ensure the input value is not longer than 17 characters
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
            onChange={handleVinChange}
            maxLength="17"
            placeholder="Enter 17-Digit VIN Number"
          />
          <button className="camera-button" onClick={() => setShowScanner(!showScanner)}>
            <img src="/camera-icon.png" alt="camera icon" />
          </button>
        </div>
        {showScanner && (
          <div id="scanner-container" className="scanner-container">
            <video ref={scannerRef} className="webcam"></video>
            {isScanning && <div className="scanning-line"></div>}
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
