// src/mockServer.ts
export const mockApiCall = async (endpoint: string, data: any) => {
  console.log(`Mock API Call to ${endpoint}:`, data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate success
  return { ok: true, json: () => Promise.resolve({ success: true }) };
};