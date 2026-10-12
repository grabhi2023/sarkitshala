const defaultAdmins = [
  'abhi.kumar252004@gmail.com',
  'amansatsangi620@gmail.com',
  'amarjeetsinghchauhan96@gmail.com',
];

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : defaultAdmins)
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const CATEGORIES = {
  arduino: { label: 'Arduino', language: 'cpp' },
  esp: { label: 'ESP32', language: 'cpp' },
  raspberry: { label: 'Raspberry Pi', language: 'python' },
};

export const DIFFICULTIES = ['basic', 'intermediate', 'advanced'];

export const DIFFICULTY_LABELS = {
  basic: 'Basic Experiments',
  intermediate: 'Intermediate Experiments',
  advanced: 'Advanced Experiments',
};

export const SESSION_COOKIE = 'sk_admin_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

export const LOGIN_MAX_ATTEMPTS = 8;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export const MAX_DOCX_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 500 * 1024;
export const TARGET_IMAGE_MIN_BYTES = 400 * 1024;
export const MAX_IMAGE_WIDTH = 1600;