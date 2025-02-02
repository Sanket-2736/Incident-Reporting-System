import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningIn: false,
  isAccepting: false,
  isLoggingIn: false,
  isUpdating: false,
  isCheckingApproval : false,
  isReportingIncident : false,
  incidents : [],
  registrations : [],
  notifications: [],

  get authRole() {
    return get().authUser?.role || null; 
  },

  register: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      if(res.data.success){
        toast.success("Registration successful!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed!";
      toast.error(errorMessage);
    } finally {
      set({ isSigningIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      if(res.data?.success){
        toast.success("Logout successful");
      }
      set({incidents: []});
      console.log(authUser);      
    } catch (error) {
      console.log("Error in logout: ", error);
      const errorMessage = error.response?.data?.message || "Logout failed!";
      toast.error(errorMessage);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      if(res.data.success){
        toast.success("Login successful!");
      } else {
        toast.error(res.data.message);
      }
      set({ authUser: res.data.user });
      console.log(authUser);
    } catch (error) {
      console.log("Error in login", error);
      const errorMessage = error.response?.data?.message || "Login failed!";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  
  checkApproval : async (data) => {
    set({isCheckingApproval : true});
    try {
      const res = await axiosInstance.post('/auth/check-approval', data);
      if(res.data.success){
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Internal Server Error!");
    }
    set({isCheckingApproval: true})
  },

  reportIncident: async (data) => {
    set({ isReportingIncident: true });
    try {
      const res = await axiosInstance.post("/auth/report-incident", data);
      if(res.data.success){
        toast.success("Incident reported successfully! We'll review it shortly.");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error in reporting: ", error);
      toast.error(
        error.response?.data?.message || "Error in reporting! Try again."
      );
    } finally {
      set({ isReportingIncident: false });
    }
  },

  findUser: async (id) => {
    try {
      const res = await axiosInstance.get(`/authority/user/${id}`);
      return res.data.user;
    } catch (error) {
      console.log("Error in finding user:", error.response?.data || error);
      return null;
    }
  },
 
  viewIncidents: async () => {
    try {
      const res = await axiosInstance.get('/authority/view-incidents');
      if (Array.isArray(res.data.data)) {
        set({ incidents: res.data.data }); // Use the 'data' field of the response
        console.log(incidents);
      } else {
        toast.error(res.data.message);
        console.error("API response is not an array:", res.data);
      }
    } catch (error) {
      console.error("Error in fetching incidents: ", error);
    }
  },  

  viewRegistrations: async () => {
    try {
      const res = await axiosInstance.get('/admin/view-registrations');
      if (Array.isArray(res.data.users)) {
        set({ registrations: res.data.users });
      } else {
        console.error("API response is not an array:", res.data);
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log('Error in fetching registrations: ', error);
      
    }
  },

  acceptUser: async (data) => {
    set({ isAccepting: true });
    try {
      console.log("User acceptation data: ", data);
      const res = await axiosInstance.post(`/admin/verify/${data.userId}`, { approval: data.approval });
      if(res.data.success){
        toast.success(data.approval ? "User accepted!" : "User rejected!");
        console.log("User accepted successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in accepting registration!");
    } finally {
      set({ isAccepting: false });
    }
  },

  updateIncident : async (data, incidentId) => {
    set({isUpdating : true});
    console.log("Data: ", data, "Id: ", incidentId)
    try {
      const res = await axiosInstance.post(`/authority/update-incident/${incidentId}`, data);
      if(res.data.success){
        toast.success("Updation successful!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.log(error);
    } finally {
      set({isUpdating: false});
    }
  },

  getNotifications: async () => {
    try {
        const res = await axiosInstance.get('/auth/notifications');
        if (res.data.success) {
            set({ notifications: res.data.notifications });
            toast.success("Notifications fetched successfully!");
        } else {
            toast.error(res.data.message || "Failed to fetch notifications.");
        }
    } catch (error) {
        console.error("Error in fetching notifications: ", error);
        toast.error("Internal Server Error");
    }
  },

  incident : {},
  viewIncident : async (id) => {
    try {
      const res = await axiosInstance.get(`/auth/view-incident/${id}`);
      if(res.data.success){
        toast.success("Incident fetched successfully!");
        set({incident : res.data.incident});
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Internal server error!")
      console.log("Error in fetching incident: ", error);
    }
  },

  report : {},
  viewReport : async (id) => {
    try {
      const res = await axiosInstance.get(`/auth/view-report/${id}`);
      if(res.data.success){
        toast.success(res.data.message);
        set({report : res.data.report});
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Internal server error!")
      console.log("Error in fetching incident: ", error);
    }
  },

  markIncidentSolved : async (id) => {
    try {
      const res = await axiosInstance.post(`/authority/mark-resolved/${id}`);
      if(res.data.success){
        toast.success(res.data.message || "Incident Marked As Completed");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error in marking event completed: ", error);
      toast.error("Internal Server Error!");
    }
  }
}));