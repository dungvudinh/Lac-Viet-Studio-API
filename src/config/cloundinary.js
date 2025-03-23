import {v2 as cloudinary} from 'cloudinary'
import {env} from './environment'
cloudinary.config({
    cloud_name:'lacvietstudio_image',
    api_key:env.API_KEY,
    api_secret:env.API_SECRET
})
export default cloudinary