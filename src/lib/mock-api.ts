import { User } from "@/types";
import { mockUsers } from "./mock-data";

// Mock API for tenant validation
// These would be replaced with actual API calls to the backend

// Simulated existing slugs/subdomains in the database
const existingSlugs = ["demo-school", "test-academy", "sample-coaching", "existing-tenant"];
const existingSubdomains = ["demo", "test", "sample", "admin", "api", "www", "app"];
const existingCustomDomains = ["school.example.com", "academy.test.com"];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface Step1ValidationResult {
  name: ValidationResult;
  slug: ValidationResult;
}

export interface Step3ValidationResult {
  subdomain: ValidationResult;
  customDomain: ValidationResult;
}

export interface EmailValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validate Step 1 fields (name and slug) against backend
 */
export async function validateStep1(name: string, slug: string): Promise<Step1ValidationResult> {
  // Simulate API call delay
  await delay(800);

  const result: Step1ValidationResult = {
    name: { isValid: true },
    slug: { isValid: true },
  };

  // Validate name (check for duplicates or reserved names)
  const reservedNames = ["admin", "test", "demo", "system"];
  if (reservedNames.includes(name.toLowerCase())) {
    result.name = {
      isValid: false,
      message: "This name is reserved and cannot be used",
    };
  }

  // Validate slug uniqueness
  if (existingSlugs.includes(slug.toLowerCase())) {
    result.slug = {
      isValid: false,
      message: "This slug is already taken. Please choose a different one.",
    };
  }

  return result;
}

/**
 * Validate Step 3 fields (subdomain and custom domain) against backend
 */
export async function validateStep3(
  subdomain: string,
  customDomain: string | undefined
): Promise<Step3ValidationResult> {
  // Simulate API call delay
  await delay(1000);

  const result: Step3ValidationResult = {
    subdomain: { isValid: true },
    customDomain: { isValid: true },
  };

  // Validate subdomain uniqueness
  if (existingSubdomains.includes(subdomain.toLowerCase())) {
    result.subdomain = {
      isValid: false,
      message: "This subdomain is already taken. Please choose a different one.",
    };
  }

  // Reserved subdomains
  const reservedSubdomains = ["admin", "api", "www", "app", "mail", "ftp", "cdn", "static"];
  if (reservedSubdomains.includes(subdomain.toLowerCase())) {
    result.subdomain = {
      isValid: false,
      message: "This subdomain is reserved and cannot be used.",
    };
  }

  // Validate custom domain if provided
  if (customDomain && customDomain.trim() !== "") {
    // Check if already in use
    if (existingCustomDomains.includes(customDomain.toLowerCase())) {
      result.customDomain = {
        isValid: false,
        message: "This domain is already registered with another tenant.",
      };
    }

    // Basic domain format validation
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    if (!domainRegex.test(customDomain)) {
      result.customDomain = {
        isValid: false,
        message: "Invalid domain format. Example: school.example.com",
      };
    }
  }

  return result;
}

/**
 * Check slug availability in real-time (debounced use)
 */
export async function checkSlugAvailability(slug: string): Promise<ValidationResult> {
  await delay(300);
  
  if (existingSlugs.includes(slug.toLowerCase())) {
    return {
      isValid: false,
      message: "This slug is already taken",
    };
  }
  
  return { isValid: true, message: "Slug is available" };
}

/**
 * Check subdomain availability in real-time (debounced use)
 */
export async function checkSubdomainAvailability(subdomain: string): Promise<ValidationResult> {
  await delay(300);
  
  const reservedSubdomains = ["admin", "api", "www", "app", "mail", "ftp", "cdn", "static"];
  
  if (reservedSubdomains.includes(subdomain.toLowerCase())) {
    return {
      isValid: false,
      message: "This subdomain is reserved",
    };
  }
  
  if (existingSubdomains.includes(subdomain.toLowerCase())) {
    return {
      isValid: false,
      message: "This subdomain is already taken",
    };
  }
  
  return { isValid: true, message: "Subdomain is available" };
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string): Promise<User[]> {
  await delay(400);

  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  return mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Validate user email (check if already exists)
 */
export async function validateUserEmail(email: string): Promise<EmailValidationResult> {
  await delay(500);

  const emailExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

  return {
    isValid: !emailExists,
    message: emailExists ? "This email is already registered" : "Email is available",
  };
}
