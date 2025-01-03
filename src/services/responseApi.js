const URL = "https://formbot-backend-c4c0.onrender.com/api";

export const getFormResponses = async (formId) => {
  try {
    const response = await fetch(`${URL}/response/${formId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `${localStorage.getItem("token")}`, // Ensure proper authorization
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching responses: ${response.statusText}`);
    }

    const data = await response.json();
    return data.responses;
  } catch (error) {
    console.error("Error in getFormResponses:", error);
    throw error;
  }
};

export const getFormStatistics = async (formId) => {
  try {
    const response = await fetch(`${URL}/form-statistics/${formId}`);
    if (!response.ok) {
      throw new Error(`Error fetching form statistics: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in getFormStatistics:", error);
    throw error;
  }
};

// export const getFormResponses = async (formId) => {
//   try {
//     const response = await fetch(`${URL}/response/${formId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("Response status:", response.status);
//     console.log("Response content-type:", response.headers.get("Content-Type"));

//     if (!response.ok) {
//       throw new Error(`Error fetching responses: ${response.statusText}`);
//     }

//     const data = await response.json(); // Ensure JSON parsing
//     console.log("Fetched data:", data);

//     return data.responses;
//   } catch (error) {
//     console.error("Error in getFormResponses:", error);
//     throw error;
//   }
// };
