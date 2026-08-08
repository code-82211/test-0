  function changeMenu(step){

 
    document.querySelectorAll(".sidebar li")
    .forEach(item => {
        item.classList.remove("active");
    });


 
    document.getElementById("menu" + step)
    .classList.add("active");

}


function nextStep(step){

       if(step === 2){

        const ip = document.getElementById("ipinp").value;

        if(!isValidIP(ip)){
            alert("لطفاً یک آدرس IP معتبر وارد کنید.");
            return;
        }
        showSummary();
    }



    document.getElementById("step" + step).style.display = "none";
    document.getElementById("step" + step).classList.remove("show");

    document.getElementById("step" + (step + 1)).style.display = "block";
    document.getElementById("step" + (step + 1)).classList.add("show");


    changeMenu(step + 1);
}


function pastStep(step){

    document.getElementById("step" + step).style.display = "none";
    document.getElementById("step" + step).classList.remove("show");

    document.getElementById("step" + (step - 1)).style.display = "block";
    document.getElementById("step" + (step - 1)).classList.add("show");


    changeMenu(step - 1);
}
function isValidIP(ip){

    if(ip.trim() === ""){
        return true;
    }

    const regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

    return regex.test(ip);
}
function showSummary(){

    const service =
        document.querySelector('input[name="service"]:checked');

    let serviceText = "انتخاب نشده";

    if(service){
        serviceText =
        service.parentElement.querySelector("h3").innerText;
    }

    const ip =
        document.getElementById("ipinp").value || "-";

    const network =
        document.getElementById("ntwk").value || "-";


    document.getElementById("resultService").innerText = serviceText;

    document.getElementById("resultIP").innerText = ip;

    document.getElementById("resultNet").innerText = network;

}

/*-- رندوم سازی --*/

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateCards() {
   //JSON:

fetch("info.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("t1").textContent = data.length;


        const vpnCount = data.filter(item =>
      item.accesses.includes("vpn")
    ).length;

   
    const databaseCount = data.filter(item =>
      item.accesses.includes("database")
    ).length;

    document.getElementById("t2").textContent = vpnCount;
    document.getElementById("t3").textContent = databaseCount;
    })
    .catch(error => console.error(error));
}

updateCards();
setInterval(updateCards, 1000);


/*
//JSON:

fetch("info.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("t1").textContent = data.length;
    })
    .catch(error => console.error(error));
    */