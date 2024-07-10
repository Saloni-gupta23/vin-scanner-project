import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library';
import './App.css';

const App = () => {
  const [vin, setVin] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    if (showScanner) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [showScanner]);

  const startScanner = () => {
    if (scannerRef.current) {
      setIsScanning(true);
      const hints = new Map();
      const formats = [
        BarcodeFormat.QR_CODE,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E
        // Add other formats as needed
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      codeReader.current.decodeFromVideoDevice(null, scannerRef.current, (result, err) => {
        if (result) {
          console.log('Scanned result:', result.getText());
          const cleanVin = cleanString(result.getText());
          setVin(cleanVin);
          setShowScanner(false);
          setIsScanning(false);
          stopScanner();
        }
        if (err) {
          if (err instanceof NotFoundException) {
            console.log('No barcode found.');
          } else {
            console.error('Error scanning barcode:', err);
          }
        }
      }, {
        video: {
          facingMode: 'environment', // Use rear camera if available
          width: 1280, // Increase resolution for better barcode detection
          height: 720
        }
      });
    }
  };

  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      setIsScanning(false);
    }
  };

  const cleanString = (str) => {
    // Remove any unwanted characters or leading/trailing whitespace
    return str.replace(/[^A-HJ-NPR-Z0-9]/g, '').trim();
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
