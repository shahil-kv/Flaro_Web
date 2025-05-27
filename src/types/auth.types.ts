export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    id: string;
    email?: string;
    phoneNumber?: string;
    // Add other user properties as needed
}

export interface LoginResponse {
    user: User;
    tokens: AuthTokens;
}

export interface RefreshTokenResponse {
    tokens: AuthTokens;
}

export interface ApiErrorResponse {
    message: string;
    errors?: { message: string }[];
}

// Add Form Data Type
export interface LoginFormData {
    email?: string;
    phoneNumber?: string;
    password: string;
}

// Add Dynamic Form Field Type
export interface DynamicField {
    name: keyof LoginFormData;
    label: string;
    type: "text" | "email" | "password" | "phone";
    placeholder: string;
    defaultCode?: string;
}