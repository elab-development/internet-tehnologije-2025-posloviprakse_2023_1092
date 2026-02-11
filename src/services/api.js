

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 API URL:', API_URL);


const getToken = () => {
  return localStorage.getItem('token');
};


const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};


const fetchWithTimeout = (url, options = {}, timeout = 30000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout - Zahtev je trajao previše dugo')), timeout)
    )
  ]);
};


const handleResponse = async (response) => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.message || `Greška: ${response.status}`);
    }
    
    console.log('✅ API Response OK:', data);
    return data;
  } catch (error) {
    console.error('❌ Response parsing error:', error);
    throw error;
  }
};


export const authAPI = {
  
  register: async (userData) => {
    console.log('📝 Starting registration request...');
    try {
      const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      }, 30000);
      console.log('✅ Registration response received');
      return handleResponse(response);
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  
  login: async (credentials) => {
    console.log('🔐 Starting login request...');
    try {
      const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      }, 30000);
      console.log('✅ Login response received');
      return handleResponse(response);
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  
  verifyEmail: async (token) => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ token }),
    });
    return handleResponse(response);
  },

  
  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  
  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ token, newPassword }),
    });
    return handleResponse(response);
  },
};


export const jobsAPI = {
  
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    const response = await fetch(`${API_URL}/jobs?${params.toString()}`);
    return handleResponse(response);
  },

  
  getMyJobs: async () => {
    const response = await fetch(`${API_URL}/jobs/my-jobs`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    return handleResponse(response);
  },

  
  create: async (jobData) => {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  
  update: async (id, jobData) => {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  
  archive: async (jobId) => {
    const response = await fetch(`${API_URL}/jobs/${jobId}/archive`, {
      method: 'PUT',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};


export const applicationsAPI = {
  
  apply: async (jobId, applicationData) => {
    const isFormData = applicationData instanceof FormData;
    const response = await fetch(`${API_URL}/applications/apply/${jobId}`, {
      method: 'POST',
      headers: isFormData ? { 'Authorization': `Bearer ${getToken()}` } : getHeaders(true),
      body: isFormData ? applicationData : JSON.stringify(applicationData),
    });
    return handleResponse(response);
  },

  
  getMyApplications: async () => {
    const response = await fetch(`${API_URL}/applications/my-applications`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  getApplicationsForJob: async (jobId) => {
    const response = await fetch(`${API_URL}/applications/job/${jobId}`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  updateStatus: async (applicationId, status) => {
    const response = await fetch(`${API_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};


export const studentAPI = {
  
  getProfile: async () => {
    const response = await fetch(`${API_URL}/student/profile`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/student/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = getToken();
    const response = await fetch(`${API_URL}/student/profile-picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  
  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append('cv', file);

    const token = getToken();
    const response = await fetch(`${API_URL}/student/upload-cv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },

  
  downloadCV: async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/student/download-cv`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Greška pri preuzimanju CV-a');
    }
    
    return response.blob();
  },

  
  deleteCV: async () => {
    const response = await fetch(`${API_URL}/student/delete-cv`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  getPublicProfile: async (studentId) => {
    const response = await fetch(`${API_URL}/student/${studentId}`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};


export const companiesAPI = {
  
  getAll: async () => {
    const response = await fetch(`${API_URL}/companies`);
    return handleResponse(response);
  },

  
  getById: async (companyId) => {
    const response = await fetch(`${API_URL}/companies/${companyId}`);
    return handleResponse(response);
  },

  
  getMyProfile: async () => {
    const response = await fetch(`${API_URL}/companies/profile/me`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/companies/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = getToken();
    const response = await fetch(`${API_URL}/companies/logo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  },
};


export const reviewsAPI = {
  
  create: async (companyId, reviewData) => {
    const response = await fetch(`${API_URL}/reviews/company/${companyId}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  
  getByCompany: async (companyId) => {
    const response = await fetch(`${API_URL}/reviews/company/${companyId}`);
    return handleResponse(response);
  },

  
  update: async (reviewId, reviewData) => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  
  delete: async (reviewId) => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};


export const adminAPI = {
  
  getStats: async () => {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  deleteUser: async (userId) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  deleteJob: async (jobId) => {
    const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  getAllJobs: async () => {
    const response = await fetch(`${API_URL}/jobs`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  
  approveJob: async (jobId) => {
    const response = await fetch(`${API_URL}/admin/jobs/${jobId}/approve`, {
      method: 'PUT',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  jobs: jobsAPI,
  applications: applicationsAPI,
  student: studentAPI,
  companies: companiesAPI,
  reviews: reviewsAPI,
  admin: adminAPI,
};
