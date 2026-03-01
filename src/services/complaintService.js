import API from "./api";

/* ===============================
   CREATE COMPLAINT
================================ */
export const createComplaint = async (formData) => {
    const response = await API.post("/complaints", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

/* ===============================
   GET USER COMPLAINTS
================================ */
export const getUserComplaints = async () => {
    const response = await API.get("/complaints");
    return response.data;
};

/* ===============================
   VERIFY IMAGE
================================ */
export const verifyComplaintImage = async (complaintId, imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await API.post(`/complaints/verify/${complaintId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
