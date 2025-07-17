import React, { useState } from 'react';

function FIRGenerator() {
  const [firData, setFirData] = useState({
    complainantName: '',
    complainantAddress: '',
    complainantPhone: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    offenseType: '',
    accusedName: '',
    accusedAddress: '',
    witnessName: '',
    witnessPhone: '',
    incidentDescription: '',
    evidenceDescription: ''
  });

  const [generatedFIR, setGeneratedFIR] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const offenseTypes = [
    "Theft (Section 378 IPC)",
    "Robbery (Section 392 IPC)",
    "Cheating (Section 420 IPC)",
    "Criminal Breach of Trust (Section 405 IPC)",
    "Assault (Section 351 IPC)",
    "Harassment (Section 354 IPC)",
    "Domestic Violence (Section 498A IPC)",
    "Cybercrime (IT Act 2000)",
    "Property Dispute",
    "Fraud",
    "Other"
  ];

  const handleInputChange = (field, value) => {
    setFirData(prev => ({ ...prev, [field]: value }));
  };

  const generateFIR = () => {
    if (!firData.complainantName || !firData.incidentDescription || !firData.offenseType) {
      alert("Please fill in the required fields: Name, Offense Type, and Incident Description");
      return;
    }

    const firNumber = `FIR-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('en-IN');

    const firTemplate = `
FIRST INFORMATION REPORT
(Under Section 154 Cr.P.C.)

FIR No: ${firNumber}
Date: ${currentDate}
Police Station: [TO BE FILLED BY POLICE]

COMPLAINANT DETAILS:
Name: ${firData.complainantName}
Address: ${firData.complainantAddress}
Phone: ${firData.complainantPhone}

INCIDENT DETAILS:
Date of Incident: ${firData.incidentDate}
Time of Incident: ${firData.incidentTime}
Place of Incident: ${firData.incidentLocation}
Type of Offense: ${firData.offenseType}

ACCUSED DETAILS (if known):
Name: ${firData.accusedName || 'Unknown'}
Address: ${firData.accusedAddress || 'Unknown'}

WITNESS DETAILS (if any):
Name: ${firData.witnessName || 'None'}
Phone: ${firData.witnessPhone || 'N/A'}

DESCRIPTION OF INCIDENT:
${firData.incidentDescription}

EVIDENCE/DOCUMENTS:
${firData.evidenceDescription || 'None mentioned'}

SECTIONS OF LAW:
${firData.offenseType}
[Additional sections to be determined by investigating officer]

COMPLAINANT'S SIGNATURE: _________________
Date: ${currentDate}

POLICE OFFICER'S REMARKS:
[TO BE FILLED BY POLICE]

Officer Name: _________________
Designation: _________________
Signature: _________________
Date: _________________

---
Note: This is a computer-generated FIR draft. Please review all details carefully before submission to police station.
    `;

    setGeneratedFIR(firTemplate);
    setShowPreview(true);
  };

  const downloadFIR = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedFIR], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `FIR_${firData.complainantName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetForm = () => {
    setFirData({
      complainantName: '',
      complainantAddress: '',
      complainantPhone: '',
      incidentDate: '',
      incidentTime: '',
      incidentLocation: '',
      offenseType: '',
      accusedName: '',
      accusedAddress: '',
      witnessName: '',
      witnessPhone: '',
      incidentDescription: '',
      evidenceDescription: ''
    });
    setGeneratedFIR('');
    setShowPreview(false);
  };

  const styles = {
    container: {
      fontFamily: 'Segoe UI, sans-serif',
      padding: '30px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
      maxWidth: '800px',
      margin: '0 auto',
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#e81c85ff',
      marginBottom: '10px'
    },
    subtext: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontWeight: '600',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '14px'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '14px',
      resize: 'vertical'
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '14px'
    },
    buttonRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      borderRadius: '6px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: '#c95bacff',
      color: 'white',
      fontWeight: '600'
    },
    secondaryButton: {
      backgroundColor: '#e5e7eb',
      color: '#111827'
    },
    previewBox: {
      whiteSpace: 'pre-wrap',
      backgroundColor: '#f9fafb',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #ccc',
      marginBottom: '20px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      {showPreview ? (
        <>
          <h2 style={styles.heading}>FIR Preview</h2>
          <pre style={styles.previewBox}>{generatedFIR}</pre>
          <div style={styles.buttonRow}>
            <button style={styles.button} onClick={downloadFIR}>Download FIR</button>
            <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => setShowPreview(false)}>Edit</button>
            <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={resetForm}>New FIR</button>
          </div>
        </>
      ) : (
        <form>
          <h2 style={styles.heading}>FIR Generator</h2>
          <p style={styles.subtext}>Please fill out the following form to generate a draft FIR.</p>

          {[
            ['Complainant Name *', 'complainantName', 'text'],
            ['Complainant Address', 'complainantAddress', 'textarea'],
            ['Complainant Phone', 'complainantPhone', 'text'],
            ['Date of Incident', 'incidentDate', 'date'],
            ['Time of Incident', 'incidentTime', 'time'],
            ['Location of Incident', 'incidentLocation', 'text'],
            ['Offense Type *', 'offenseType', 'select'],
            ['Accused Name', 'accusedName', 'text'],
            ['Accused Address', 'accusedAddress', 'text'],
            ['Witness Name', 'witnessName', 'text'],
            ['Witness Phone', 'witnessPhone', 'text'],
            ['Incident Description *', 'incidentDescription', 'textarea'],
            ['Evidence Description', 'evidenceDescription', 'textarea'],
          ].map(([label, field, type]) => (
            <div key={field} style={styles.formGroup}>
              <label style={styles.label}>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  style={styles.textarea}
                  rows={field === 'incidentDescription' ? 5 : 3}
                  value={firData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              ) : type === 'select' ? (
                <select
                  style={styles.select}
                  value={firData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                >
                  <option value="">Select an offense</option>
                  {offenseTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  style={styles.input}
                  value={firData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              )}
            </div>
          ))}

          <div style={styles.buttonRow}>
            <button type="button" style={styles.button} onClick={generateFIR}>Generate FIR</button>
            <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={resetForm}>Reset Form</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FIRGenerator;
