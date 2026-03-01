import API from "./api";

/* ===============================
   GET ALL COMPLAINTS
================================ */
export const getAllComplaints = async () => {
    const response = await API.get("/admin/complaints");
    return response.data;
};

/* ===============================
   APPROVE COMPLAINT
================================ */
export const approveComplaint = async (id, stationData) => {
    const response = await API.put(`/admin/approve/${id}`, stationData);
    return response.data;
};

/* ===============================
   MARK COMPLETED
================================ */
export const markCompleted = async (id, completionData) => {
    const response = await API.put(`/admin/complete/${id}`, completionData);
    return response.data;
};

/* ===============================
   GET COMPLETED CASES
================================ */
export const getCompletedCases = async () => {
    const response = await API.get("/admin/completed");
    return response.data;
};
