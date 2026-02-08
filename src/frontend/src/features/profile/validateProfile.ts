export interface ProfileValidationErrors {
  displayName?: string;
  bio?: string;
  socialLinks?: string[];
}

export function validateProfile(
  displayName: string,
  bio: string,
  socialLinks: string[]
): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  // Display name validation
  if (!displayName.trim()) {
    errors.displayName = 'Display name is required';
  } else if (displayName.trim().length < 2) {
    errors.displayName = 'Display name must be at least 2 characters';
  } else if (displayName.trim().length > 50) {
    errors.displayName = 'Display name must be less than 50 characters';
  }

  // Bio validation
  if (bio.length > 500) {
    errors.bio = 'Bio must be less than 500 characters';
  }

  // Social links validation
  const linkErrors: string[] = [];
  socialLinks.forEach((link, index) => {
    if (link.trim()) {
      try {
        const url = new URL(link.trim());
        if (!url.protocol.startsWith('http')) {
          linkErrors[index] = 'Link must start with http:// or https://';
        }
      } catch {
        linkErrors[index] = 'Invalid URL format';
      }
    }
  });

  if (linkErrors.length > 0) {
    errors.socialLinks = linkErrors;
  }

  return errors;
}

