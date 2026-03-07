import axios from "axios";

export class orderService {
  constructor() {
    this.instance = axios.create({
      baseURL: "https://hirelingbackend.onrender.com/api/v1/orders",
    });

    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
       
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  async generateOrder(projectId) {
    try {
      return this.instance.post(`/placeOrder/${projectId}`);
    } catch (error) {
      return ("OrderService :: Logout Error", error);
    }
  }

  async cancelOrder(orderId) {
    try {
      return this.instance.patch(`/${orderId}/cancel`);
    } catch (error) {
      return ("OrderService :: Logout Error", error);
    }
  }

  async fetchOrderForCustomer(id) {
    try {
      return this.instance.get(`/user/${id}`);
    } catch (error) {
      return ("OrderService :: Logout Error", error);
    }
  }

  async fetchOrderForWorker(id) {
    try {
      return this.instance.get(`/worker/${id}`);
    } catch (error) {
      return ("WorkerService :: Fetch Acitve Worker Error", error);
    }
  }

  async fetchVerifiedOrderForWorker(id) {
    try {
      return this.instance.get(`/worker/${id}/verified`);
    } catch (error) {
      return ("OrderService :: Logout Error", error);
    }
  }

  async fetchCompletedOrderForCustomer(id) {
    try {
      return this.instance.get(`/user/${id}/completed`);
    } catch (error) {
      return ("OrderService :: Logout Error", error);
    }
  }

  async fetchCompletedOrderForWorker(id) {
    try {
      return this.instance.get(`/worker/${id}/completed`);
    } catch (error) {
      return ("OrderService :: Logout Error", error);
    }
  }

  async fetchOrderDetail(orderId) {
    try {
        return this.instance.get(`/details/${orderId}`)
    } catch (error) {
      return ("OrderService :: Logout Error", error);
    }
  }

  async completion(orderId, obj) {
    try {
      return this.instance.post(`/${orderId}/complete`, obj);
    } catch (error) {
      return ("OrderService :: Logout Error", error);
    }
  }

  async verify(verificationCode) {
    try {
      return this.instance.patch("/verify", { verificationCode });
    } catch (error) {
      return ("OrderService :: verification Error", error);
    }
  }
}

const Service = new orderService();

export default Service;
