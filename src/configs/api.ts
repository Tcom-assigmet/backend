//defne base url
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export const API_ENDPOINTS = {
    //defne api endpoints   for befit calculator
  START_BENEFIT_CALCULATOR: `${API_BASE_URL}/benefit/start`,
  COMPLETE_BENEFIT_CALCULATOR: `${API_BASE_URL}/benefit/complete`,
};