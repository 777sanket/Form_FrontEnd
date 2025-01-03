const URL = "https://formbot-backend-c4c0.onrender.com/api";
// const URL = "http://localhost:3000/api";

export const register = (data) => {
  return fetch(`${URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const login = (data) => {
  return fetch(`${URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const logout = () => {
  return fetch(`${URL}/user/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getDashboard = async () => {
  const response = await fetch(`${URL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`, // Include the Bearer token
    },
  });

  const data = await response.json(); // Parse the JSON response
  return {
    status: response.status, // Include the status code
    data, // Include the response body
  };
};

export const createDashboardItem = (
  name,
  type,
  folderName = null,
  dashboardOwner = "my"
) => {
  return fetch(`${URL}/dashboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ name, type, folderName, dashboardOwner }),
  });
};

export const deleteDashboardItem = (
  name,
  type,
  folderName = null,
  dashboardOwner = "my"
) => {
  return fetch(`${URL}/dashboard`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ name, type, folderName, dashboardOwner }),
  });
};

export const shareDashboard = async (email, accessType) => {
  const response = await fetch(`${URL}/dashboard/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ email, accessType }),
  });

  return {
    status: response.status,
    data: await response.json(),
  };
};

// Get dashboards shared with the current user
export const getSharedDashboards = async () => {
  const response = await fetch(`${URL}/dashboard/shared`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json(); // Parse the JSON response
  return {
    status: response.status, // Include the status code
    data, // Include the response body
  };
};

// Generate Shareable Link
export const generateShareLink = async (accessType) => {
  const response = await fetch(`${URL}/dashboard/generate-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ accessType }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data,
  };
};

export const accessSharedDashboard = async (token) => {
  const response = await fetch(`${URL}/dashboard/access-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ token }),
  });

  return {
    status: response.status,
    data: await response.json(),
  };
};
