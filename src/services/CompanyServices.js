import apiClient from "./services";

export default {
  getCompanies() {
    return apiClient.get("company");
  },
  getCompany(id) {
    return apiClient.get("company/" + id);
  },
  addCompany(company) {
    return apiClient.post("company", company);
  },
  updateCompany(company) {
    return apiClient.put("company/" + company.id, company);
  },
  deleteCompany(companyId) {
    return apiClient.delete("company/" + companyId);
  },
};
