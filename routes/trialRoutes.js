import express from 'express';
import path from 'path';
import { readJSON, writeJSON } from '../utils/jsonStore.js';

const router = express.Router();

const DATA_DIR = path.join(process.cwd(), 'data');
const TRIALS_FILE = path.join(DATA_DIR, 'trials.json');

// Trial config
const TRIAL_DAYS = 3;
const MAX_PER_DAY = 3; // max generate (photo+video) per day

async function getTrials() {
  return await readJSON(TRIALS_FILE, []);
}

async function saveTrials(trials) {
  await writeJSON(TRIALS_FILE, trials);
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Start a trial for an identifier (email or client id)
router.post('/start', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, error: 'Missing userId' });

    const trials = await getTrials();
    const existing = trials.find(t => t.userId === userId);
    if (existing) return res.json({ success: true, trial: existing, message: 'Trial already started' });

    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setDate(expiresAt.getDate() + TRIAL_DAYS);

    const trial = {
      userId,
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      usage: {
        // dateKey: count
      }
    };

    trials.push(trial);
    await saveTrials(trials);
    return res.json({ success: true, trial });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Check trial status
router.get('/status/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const trials = await getTrials();
    const trial = trials.find(t => t.userId === userId);
    if (!trial) return res.json({ success: true, trial: null });

    const now = new Date();
    const expired = new Date(trial.expiresAt) <= now;
    const dateKey = todayKey();
    const todayCount = trial.usage && trial.usage[dateKey] ? trial.usage[dateKey] : 0;

    return res.json({ success: true, trial: { ...trial, expired, todayCount, maxPerDay: MAX_PER_DAY } });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Consume one quota (called before generating media). Returns allowed: true/false
router.post('/consume', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, error: 'Missing userId' });

    const trials = await getTrials();
    const idx = trials.findIndex(t => t.userId === userId);
    if (idx === -1) return res.json({ success: false, allowed: false, reason: 'No active trial' });

    const trial = trials[idx];
    const now = new Date();
    if (new Date(trial.expiresAt) <= now) return res.json({ success: false, allowed: false, reason: 'Trial expired' });

    const dateKey = todayKey();
    trial.usage = trial.usage || {};
    const todayCount = trial.usage[dateKey] || 0;
    if (todayCount >= MAX_PER_DAY) return res.json({ success: false, allowed: false, reason: 'Daily quota exceeded' });

    // consume one
    trial.usage[dateKey] = todayCount + 1;
    trials[idx] = trial;
    await saveTrials(trials);

    return res.json({ success: true, allowed: true, remainingToday: MAX_PER_DAY - trial.usage[dateKey] });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
