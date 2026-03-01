import API from "./api";

/* ===============================
   VERIFY UNKNOWN PERSON
================================ */
export const verifyUnknownPerson = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await API.post("/face/verify", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};
