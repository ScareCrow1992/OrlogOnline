
let login_dom = document.getElementById("gate_login")

google.accounts.id.initialize({
    client_id: "<client id>",
    auto_select: false,
    close_on_tap_outside: false,
    ux_mode : false,
    callback: handleCredentialResponse
});
google.accounts.id.renderButton(
    login_dom,
    {
        theme: "outline",
        size: "large",
    }  // customization attributes
);
google.accounts.id.prompt(); // also display the One Tap dialog


function handleCredentialResponse(response) {
    console.log(response)
    
    let responsePayload = parseJwt(response.credential);
    console.log(responsePayload)
    let sub = responsePayload.sub
    let idToken = response.credential;

    const config_ = {headers: { Authorization: `Bearer ${idToken}` }}
    const bodyParameters = { key: "value" };

    fetch("http://localhost:3000/oauth/google/endpoint", {
        method:"POST",
        body : JSON.stringify({key: "value"}),
        headers: { Authorization: `Bearer ${idToken}` }
    })
    
    // axios.post(
    //     "http://localhost:3000/oauth/google/endpoint" ,
    //     bodyParameters,
    //     config_
    // )
    // .then((ret)=>{console.log(ret)})

}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}