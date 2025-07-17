import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Using the '@' alias

// --- NEW Full Screen UI Styles ---
const styles = {
  // This new 'page' style creates the full-screen background and centers the form
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(170deg, #F7F5FF 0%, #E6E0F8 100%)', // Lovely gradient
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  },
  // The container style has been slightly adjusted
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slightly transparent white for a softer look
    backdropFilter: 'blur(10px)', // Glassmorphism effect
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(106, 90, 205, 0.2)', // Softer shadow
    maxWidth: '500px',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px', // Increased gap for more breathing room
  },
  header: {
    marginBottom: '5px',
    color: '#483D8B',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.75em',
  },
  paragraph: {
    fontSize: '1em',
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: '25px',
    lineHeight: '1.6',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#483D8B',
    display: 'block',
  },
  input: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E6E0F8',
    borderRadius: '10px',
    padding: '15px',
    fontSize: '1em',
    width: '100%',
    boxSizing: 'border-box',
    color: '#333',
  },
  textarea: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E6E0F8',
    borderRadius: '10px',
    padding: '15px',
    fontSize: '1em',
    minHeight: '120px',
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box',
    color: '#333',
  },
  button: {
    padding: '15px 20px',
    backgroundColor: '#6A5ACD',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
    boxShadow: '0 4px 15px rgba(106, 90, 205, 0.2)',
  },
  buttonHover: {
     backgroundColor: '#7B68EE',
     transform: 'scale(1.02)',
  },
  feedbackSuccess: {
    color: '#483D8B',
    backgroundColor: '#E6E0F8',
    border: '1px solid #C9BFF0',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  feedbackError: {
    color: '#B00020',
    backgroundColor: '#FDECEA',
    border: '1px solid #F8C0C8',
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  }
};


const AnonymousReporting = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState('idle');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageUrl || !reason) {
      alert('Please provide the image URL and a reason for the report.');
      return;
    }
    setStatus('submitting');
    try {
      const { error } = await supabase
        .from('reports')
        .insert([{ image_url: imageUrl, reason: reason, details: details }]);
      if (error) { throw error; }
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setImageUrl('');
        setReason('');
        setDetails('');
      }, 4000);
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
    }
  };

  // The main component now returns a full-page wrapper `div`
  return (
    <div style={styles.page}>
      {status === 'success' ? (
        <div style={styles.container}>
          <div style={styles.feedbackSuccess}>
            ✅ Thank you! Your report has been submitted successfully.
          </div>
        </div>
      ) : (
        <div style={styles.container}>
          <h2 style={styles.header}>You're safe here, and you're not alone.</h2>
          <p style={styles.paragraph}>
            Report harmful content anonymously. Your privacy is our priority.
          </p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div>
              <label htmlFor="imageUrl" style={styles.label}>URL of the Harmful Image*</label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div>
              <label htmlFor="reason" style={styles.label}>Primary Reason*</label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.e.target.value)}
                style={styles.input}
                required
              >
                <option value="" disabled>Select a reason...</option>
                <option value="hate_speech">Hate Speech</option>
                <option value="harassment">Harassment or Bullying</option>
                <option value="nudity_or_sexual_content">Nudity or Sexual Content</option>
                <option value="graphic_violence">Graphic Violence</option>
                <option value="impersonation">Impersonation</option>
                <option value="deepfake_or_manipulated_media">Deepfake or Manipulated Media</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="details" style={styles.label}>Additional Context (Optional)</label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={styles.textarea}
                placeholder="Provide any extra information that might be helpful."
              />
            </div>
            {status === 'error' && <p style={styles.feedbackError}>Something went wrong. Please try again.</p>}
            <button
              type="submit"
              style={{ ...styles.button, ...(isHovered ? styles.buttonHover : null) }}
              disabled={status === 'submitting'}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Anonymously'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AnonymousReporting;