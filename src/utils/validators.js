// ObjectId regex 
export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

// Password regex: min 6, max 100, letters, numbers, special characters
export const PASSWORD_RULE = /^[a-zA-Z0-9!@#$%^&*()_+=\-]{6,100}$/;
export const PASSWORD_RULE_MESSAGE = 'Password must be 6-100 characters and contain only letters, numbers, and valid symbols (!@#$%^&* etc)';