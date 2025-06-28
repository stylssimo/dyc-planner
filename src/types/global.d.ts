// src/types/global.d.ts

// Extend the global Window interface to include the 'google' object
interface Window {
    google: any; // 'any' is used here because the full type definition for Google's GSI library is complex
}

// Optionally, if you also refer to 'google' directly (not as window.google),
// you can keep this global declaration as well.
declare const google: any;