const API_BASE = '';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Workshop API calls
export const workshopApi = {
  getAll: () => apiRequest('/api/workshops'),
  getById: (id: number) => apiRequest(`/api/workshops/${id}`),
  create: (workshop: any) => apiRequest('/api/workshops', {
    method: 'POST',
    body: JSON.stringify(workshop),
  }),
};

// Registration API calls
export const registrationApi = {
  create: (registration: any) => apiRequest('/api/registrations', {
    method: 'POST',
    body: JSON.stringify(registration),
  }),
  getMy: () => apiRequest('/api/registrations/my'),
};

// Enterprise API calls
export const enterpriseApi = {
  getWorkshops: () => apiRequest('/api/enterprise/workshops'),
  getRegistrations: (workshopId: number) => apiRequest(`/api/enterprise/registrations/${workshopId}`),
};

// Admin API calls
export const adminApi = {
  getUsers: () => apiRequest('/api/admin/users'),
  getEnterprises: () => apiRequest('/api/admin/enterprises'),
  getWorkshops: () => apiRequest('/api/admin/workshops'),
  updateWorkshopStatus: (id: number, status: string) => apiRequest(`/api/admin/workshops/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  updateEnterpriseStatus: (id: number, status: string) => apiRequest(`/api/admin/enterprises/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  updateRegistrationStatus: (id: number, status: string) => apiRequest(`/api/admin/registrations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};