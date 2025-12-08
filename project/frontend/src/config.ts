import Constants from "expo-constants";
import { Platform } from "react-native";

declare const process: {
  env?: {
    EXPO_PUBLIC_API_URL?: string;
  };
};

const PORT = 4000;
const envBaseUrl = process.env?.EXPO_PUBLIC_API_URL;

const getDebugServerHost = () => {
  // Try multiple sources for the host
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).expoGoConfig?.debuggerHost ??
    (Constants as any).manifest?.debuggerHost ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

  if (!hostUri) return undefined;
  const [host] = hostUri.split(":");
  return host;
};

const getLocalBaseUrl = () => {
  if (Platform.OS === "web") {
    return `http://localhost:${PORT}`;
  }

  // For iOS Simulator and Android Emulator, try to get the dev machine IP
  const devHost = getDebugServerHost();
  
  if (devHost && devHost !== "localhost" && devHost !== "127.0.0.1") {
    console.log(`[Rinku] Using detected host: ${devHost}:${PORT}`);
    return `http://${devHost}:${PORT}`;
  }

  // Fallback for Android emulator
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${PORT}`;
  }

  // iOS Simulator can use localhost
  return `http://localhost:${PORT}`;
};

export const BASE_URL = envBaseUrl ?? getLocalBaseUrl();

// Log the URL being used
console.log(`[Rinku] API Base URL: ${BASE_URL}`);
