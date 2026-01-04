import {env} from '@/config/env'

export async function submitWeb3Form(formData) {
    if(!env.web3FormKey) {
        return{
            success: false,
            message: "Web3Forms is not configured"
        }
    }
    
    formData.append("access_key", env.web3FormKey);

    const response = await fetch(env.web3FormUrl, {
        method: "POST",
        body: formData
    })
    return response.json();
}