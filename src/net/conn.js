let baseURL='http://localhost:80/nov'
function ajax(apiURL,data){

    return new Promise((resolve,reject)=>{
        let req=new XMLHttpRequest();
        let url=baseURL+apiURL;
        req.open('POST',url);
        let json_str=encodeURI(encodeURI(JSON.stringify(data)));

        req.onload = function () {
            if (req.status === 200) { 
                    resolve(req.responseText);
                } else {
                    reject(new Error(req.status+':\n'+req.responseText));
                } 
            };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };

        req.send(json_str);
    })
}

export default ajax;