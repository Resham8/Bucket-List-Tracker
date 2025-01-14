const url = "http://localhost:3000/goals";
function sendRequest(){
    axios.post(url,{
        title: document.getElementById("new-item").value,
        isCompleted: false       
    })
}
