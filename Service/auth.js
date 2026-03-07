import axios from 'axios';



export class AuthService{
    constructor(){

    this.instance = axios.create({
     baseURL: 'https://hirelingbackend.onrender.com/api/v1/auth',
         });
        
    }

    
    async login(formData){
        try {
            const data = await this.instance.post('/login',formData,{
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },)
       
            const {accessToken,refreshToken} = data?.data?.data
      
            localStorage.setItem('accessToken',accessToken)
            localStorage.setItem('refreshToken',refreshToken)
            axios.defaults.headers.common['Authorization'] =   `Bearer ${accessToken}`

            return data
        } catch (error) {
            return ("AuthService :: Login Error", error)
        }
    }


    async Logout(){
        try {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            delete axios.defaults.headers.common['Authorization']
            return await this.instance.post('/logout')
        } catch (error) {
            return ("AuthService :: Logout Error", error)
        }
    }

    async getCurrentUser(){
        try {
            
             const accessToken = localStorage.getItem('accessToken')
             
             
             if(!accessToken) return null
             axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
             return await this.instance.get('/current-user',
                {
                    headers: { Authorization:`Bearer ${accessToken}` }
                }
            )


        } catch (error) {
            console.log(error)
        }
    }


  async logout() {
  try {
   
    const res=await this.instance.post('/logout',{}, { withCredentials: true });
    
  } catch (err) {
    console.error("AuthService :: Logout Error", err);
    return false;
  }finally {
   
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    
    delete axios.defaults.headers.common['Authorization'];
    delete this.instance.defaults.headers.common['Authorization'];
  }
  
  return true; 
}

}

const Service = new AuthService()


export default Service