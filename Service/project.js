import axios from "axios";

export class ProjectService{
    constructor(){
        this.instance = axios.create({
            // baseURL: 'http://localhost:8080/api/v1/project',
            baseURL: 'https://hirelingbackend.onrender.com/api/v1/project',
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

    async requestAppointment(formData){
        try{
            return this.instance.post("/request",formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Important!
            },
          },)
        } catch (error){
            return("ProjectService :: Appointment request Error", error)
        }


    }
    async deleteAppointment(id){
        try{
            return this.instance.delete(`/delete/${id}`)
        } catch (error){
            return("ProjectService :: Appointment request Error", error)
        }

    }
}

const Service = new ProjectService()


export default Service