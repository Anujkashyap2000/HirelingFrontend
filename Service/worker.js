import axios from "axios";
import authService from "../Service/auth"

export class workerService{
    constructor(){
        this.instance = axios.create({
            baseURL: 'https://hirelingbackend.onrender.com/api/v1/workers',
        })

        this.instance.interceptors.request.use(
            (config) =>{
                const accessToken = localStorage.getItem('accessToken')
                if(accessToken){
                    config.headers.Authorization = `Bearer ${accessToken}`
                   
                }
                return config
            },
            (error) => Promise.reject(error)
        )
    }



    
    async register(formData){
        try{
            return this.instance.post("/register",formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Important!
            },
          },)
        } catch (error){
            return("AuthService :: Register Error", error)
        }

    }

    async updateUser(id,payLoad){
        try{
            return this.instance.put(`/update/${id}`,payLoad,{
        headers: { "Content-Type": "multipart/form-data" },
      })
    console.log(payLoad);
    
        } catch (error){
            return("CustomerService :: fetchAcceptedAppointment Error", error)
        }

    }


async getActiveWorker(obj){

     try{
        console.log(obj);
        
             return this.instance.post(`/pincode`,obj)
     
        } catch (error){
            return("WorkerService :: Fetch Acitve Worker Error", error)
        }

}//

async toggleStatus(id){

    try{
            return this.instance.patch(`/${id}/status`)
        } catch (error){
            return("WorkerService :: Fetch Toggle status Error", error)
        }

}

async fetchAppointmentRequestForWorker(id){

    try{
            return this.instance.get(`/${id}/requested`)
        } catch (error){
            return("WorkerService :: Fetch Acitve Worker Error", error)
        }

}

async fetchAcceptedAppointmentForWorker(id){

    try{
            return this.instance.get(`/${id}/accepted`)
        } catch (error){
            return("WorkerService :: Fetch Acitve Worker Error", error)
        }

}



async acceptAppointment(id){

    try{
            return this.instance.put(`/accept/${id}`)
        } catch (error){
            return("WorkerService :: accept Appointment Error", error)
        }

}

async unAcceptAppointment(id){

    try{
            return this.instance.put(`/unaccept/${id}`)
        } catch (error){
            return("WorkerService :: Unaccept Appointment Error", error)
        }

}

async rejectAppointment(id){

    try{
            return this.instance.put(`/reject/${id}`)
        } catch (error){
            return("WorkerService :: reject Appointment Error", error)
        }

}


}



const Service = new workerService()


export default Service