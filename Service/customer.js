import axios from "axios";

export class CustomerService{
    constructor(){
        this.instance = axios.create({
            baseURL: 'https://hirelingbackend.onrender.com/api/v1/users',
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

    async register(signupuser){
        try{
            return this.instance.post("/register",signupuser, {
          headers: { "Content-Type": "application/json" },
        })
        } catch (error){
            return("AuthService :: Register Error", error)
        }

    }

    async fetchRequestedAppointment(id){
        try{
            return this.instance.get(`/${id}/requested`)
        } catch (error){
            return("CustomerService :: fetchRequestedAppointment Error", error)
        }

    }

    async fetchAcceptedAppointment(id){
        try{
            return this.instance.get(`/${id}/accepted`)
        } catch (error){
            return("CustomerService :: fetchAcceptedAppointment Error", error)
        }

    }

    async updateUser(id,userDetails){
        try{
            return this.instance.put(`/update/${id}`,userDetails,{
        headers: { "Content-Type": "application/json" },
      })
        } catch (error){
            return("CustomerService :: fetchAcceptedAppointment Error", error)
        }

    }

    
}

const Service= new CustomerService()

export default Service;