"use client";

// Re-export from Zustand store to maintain backward compatibility
export {
  useAuthStore,
  useAuth,
  AuthProvider,
  type AuthModalMode,
  type AuthState as AuthContextType,
} from "../store/auth-store";
