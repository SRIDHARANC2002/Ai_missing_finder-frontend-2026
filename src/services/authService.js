import API from "./api";

/* ===========================
   USER REGISTER
=========================== */
export const register = async (formData) => {
  const response = await API.post("/auth/register", {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    agreeToTerms: formData.agreeToTerms
  });

  return response.data;
};

app.options("*", cors()); // handle preflight for ALL routes


/* ===========================
   LOGIN
=========================== */
export const login = async (email, password, role) => {
  const endpoint = role === "admin" ? "/auth/police/login" : "/auth/login";
  const response = await API.post(endpoint, {
    email,
    password
  });

  return response.data;
};