const URL = "https://formbot-backend-c4c0.onrender.com/api";
// const URL = "http://localhost:3000/api";

// Get workspace data for a specific form
export const getWorkspaceData = async (formId) => {
  try {
    const response = await fetch(`${URL}/workspace/form/${formId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`, // Include the user's token
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching workspace data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getWorkspaceData:", error);
    throw error;
  }
};

export const getWorkspaceDataForBot = async (formId) => {
  try {
    const response = await fetch(`${URL}/workspace/formBot/${formId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `${localStorage.getItem("token")}`, // Include the user's token
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching workspace data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getWorkspaceData:", error);
    throw error;
  }
};

// Save workspace data (post updated bubbles)
export const saveWorkspaceData = async (formId, bubbles) => {
  try {
    const response = await fetch(`${URL}/workspace/form/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`, // Include the user's token
      },
      body: JSON.stringify(bubbles), // Include bubbles as form elements
    });

    if (!response.ok) {
      throw new Error(`Error saving workspace data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in saveWorkspaceData:", error);
    throw error;
  }
};

export const deleteBubble = async (formId, bubbleId) => {
  try {
    const response = await fetch(
      `${URL}/workspace/form/${formId}/${bubbleId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`, // Include the user's token
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting bubble: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in deleteBubble:", error);
    throw error;
  }
};

export const editFormName = async (formId, newName) => {
  try {
    const response = await fetch(`${URL}/workspace/form/${formId}/name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`, // Include the user's token
      },
      body: JSON.stringify({ name: newName }), // Include the new form name
    });

    if (!response.ok) {
      throw new Error(`Error editing form name: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in editFormName:", error);
    throw error;
  }
};
