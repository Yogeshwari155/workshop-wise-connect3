
const API_BASE = '/api';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

interface Workshop {
  id: number;
  title: string;
  company: string;
  date: string;
  mode: string;
  price: number;
  seats: number;
  registeredSeats: number;
  registrationMode: string;
  image?: string;
  meetLink?: string;
  location?: string;
}

interface Registration {
  id: number;
  workshopId: number;
  userId: number;
  status: string;
  reason?: string;
  createdAt: string;
  workshop?: Workshop;
}

export const workshopApi = {
  getAll: async (): Promise<Workshop[]> => {
    const response = await fetch(`${API_BASE}/workshops`);
    if (!response.ok) throw new Error('Failed to fetch workshops');
    return response.json();
  },

  getById: async (id: number): Promise<Workshop> => {
    const response = await fetch(`${API_BASE}/workshops/${id}`);
    if (!response.ok) throw new Error('Failed to fetch workshop');
    return response.json();
  },

  create: async (data: Partial<Workshop>): Promise<Workshop> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/workshops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create workshop');
    return response.json();
  }
};

export const registrationApi = {
  getMy: async (): Promise<Registration[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/registrations/my`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch registrations');
    return response.json();
  },

  create: async (data: { workshopId: number; reason?: string; paymentScreenshot?: File | null }): Promise<Registration> => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const requestBody = {
      workshopId: data.workshopId,
      reason: data.reason || '',
      paymentScreenshot: data.paymentScreenshot ? data.paymentScreenshot.name : null
    };

    const response = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create registration');
    }
    return response.json();
  }
};

export const enterpriseApi = {
  getWorkshops: async (): Promise<Workshop[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/enterprise/workshops`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch enterprise workshops');
    return response.json();
  },

  getRegistrations: async (workshopId: number): Promise<Registration[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/enterprise/registrations/${workshopId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch registrations');
    return response.json();
  }
};
