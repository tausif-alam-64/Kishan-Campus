export async function submitWeb3Form(formData) {
    const endpoint = "https://api.web3forms.com/submit"

    const response = await fetch(endpoint, {
        method: "POST",
        body: formData
    })
    return response.json();
}