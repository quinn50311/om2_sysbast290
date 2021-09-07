import http from "../common/http-common";

class UserDataService{
    static apiPrefix = "/userInfos";

    getUserInfos(params) {
        console.log(`branchId=${params.branchId} orgId=${params.organizationId} p=${params.p}`);
        return http.get(`${UserDataService.apiPrefix}`, {params});
    }

    findByBranch(branchId) {
        return http.get(`${UserDataService.apiPrefix}?branchId=${branchId}`);
    }

    findByOrganization(orgId) {
        return http.get(`${UserDataService.apiPrefix}?organizationId=${orgId}`);
    }

    get(id) {
        return http.get(`${UserDataService.apiPrefix}/${id}`);
    }

    create(data) {
        return http.post(`${UserDataService.apiPrefix}`, data);
    }

    update(id, data) {
        return http.put(`${UserDataService.apiPrefix}/${id}`, data);
    }

    delete(id) {
        return http.delete(`${UserDataService.apiPrefix}/${id}`)
    }
}

export default new UserDataService();