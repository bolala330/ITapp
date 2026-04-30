// backend/index.js

// 1. Import Libraries
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// 2. Setup Firebase Admin
// Ensure 'serviceAccountKey.json' is in this folder
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

// 3. Middleware
app.use(cors()); // Allow React Native to connect
app.use(express.json());

const PORT = 3000;

// 4. API Routes

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
  res.send('LUCT Backend Running on Node.js');
});

// --- LECTURER MODULE (Report Form) ---

// Submit a New Report
app.post('/api/reports', async (req, res) => {
  try {
    // Receives all form fields (faculty, className, week, date, courseName, etc.)
    const reportData = req.body;
    
    // Add server-side timestamp and status
    reportData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    reportData.status = 'Pending'; // For PRL review

    const docRef = await db.collection('reports').add(reportData);
    res.status(201).json({ message: 'Report submitted successfully', id: docRef.id });
  } catch (error) {
    console.error("Submit Report Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- PRINCIPAL / PROGRAM LEADER MODULE ---

// Get All Reports (For PRL/PL)
app.get('/api/reports', async (req, res) => {
  try {
    const snapshot = await db.collection('reports').orderBy('createdAt', 'desc').get();
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Feedback (PRL Only)
app.post('/api/reports/feedback', async (req, res) => {
  try {
    const { uid, reportId, feedbackText } = req.body;

    // 1. Security Check: Verify user is PRL
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'PRL') {
      return res.status(403).json({ error: 'Permission Denied: Only PRL can add feedback' });
    }

    // 2. Update Report
    await db.collection('reports').doc(reportId).update({
      feedback: feedbackText,
      feedbackBy: uid,
      feedbackDate: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Feedback added securely' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ATTENDANCE MODULE ---

// Get Attendance
app.get('/api/attendance', async (req, res) => {
  try {
    const { courseCode, studentId } = req.query;
    let queryRef = db.collection('attendance');

    if (courseCode) queryRef = queryRef.where('courseCode', '==', courseCode);
    if (studentId) queryRef = queryRef.where('studentId', '==', studentId);

    const snapshot = await queryRef.get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No records found' });
    }

    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Attendance
app.post('/api/attendance/mark', async (req, res) => {
  try {
    const { courseCode, date, studentId, status } = req.body;
    
    const newDocRef = await db.collection('attendance').add({
      courseCode,
      date,
      studentId,
      status,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Attendance marked', id: newDocRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});