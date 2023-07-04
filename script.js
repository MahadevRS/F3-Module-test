let ip = "";
let Postoffice = {};
async function loadPage() {
    try {
        await $.getJSON("https://api.ipify.org?format=json", function (data) {
            ip = data.ip;
            let p = document.getElementsByClassName("ip-class")[0];
            p.innerHTML = `MY Public IP ADDRESS : ${ip}`;
        })
    }
    catch {
        alert("Error getting IP");
    }
}

loadPage();

async function getData() {
    let div = document.getElementById("before-load")
    div.style.display = "none";
    let data = {};
    try {
        let response = await fetch(`https://ipinfo.io/${ip}/geo?token=c9527d8e4f6c9b`);
        data = await response.json();
        console.log(data);
    }
    catch {
        alert("Error getting Details from IP");
    }
    loadDataToWebPage(data);
    loadPincodes(data.postal);
}

function loadDataToWebPage(data) {
    let lat = data.loc.split(",")[0];
    let long = data.loc.split(",")[1];
    let datetime = new Date().toLocaleString("en-US", { timeZone: `${data.timezone}` });
    let container = document.getElementById("container");
    let dataContainer = document.getElementById("after-load");
    dataContainer.style.display = "block";
    dataContainer.innerHTML =
        `<p id="ip-id">MY Public IP ADDRESS : ${ip}</p>
   <div id="header">
       <div id="left">
           <p class="org">Lat: <span>${lat}</span></p>
           <p class="org">Long: <span>${long}</span></p>
       </div>
       <div id="mid">
           <div class="org">City: <span>${data.city}</span></div>
           <div class="org">Region: <span>${data.region}</span></div>
       </div>
       <div id="right">
           <div class="org">Organisation: <span>${data.org}</span></div>
           <div class="org">Hostname: <span>${data.org}</span></div>
       </div>
   </div>
   <Iframe
   src="https://maps.google.com/maps?q=${lat}, ${long}&output=embed"
   ></Iframe>
   <div id="footer">
       <p>Time Zone: <span>${data.timezone}</span></p>
       <p>Date And Time: <span>${datetime}</span></p>
       <P>Pincode: <span>${data.postal}</span></P>
   </div>`;
    container.append(dataContainer);
}
function btnClicked() {
    getData();
}

async function loadPincodes(pincode) {
    let response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    let areas = await response.json();
    let footer = document.getElementById("footer");
    let p = document.createElement("p");
    p.innerHTML = `Message: <span>${areas[0].Message}</span>`;
    footer.append(p);
    let container = document.getElementById("post-offices");
    container.style.display = "block";
    Postoffice = areas[0].PostOffice;
    loadareas(areas[0].PostOffice);
}

function loadareas(PostOffice) {
    let div = document.getElementById("card-container");
    div.innerHTML = "";
    for (let i = 0; i < PostOffice.length; i++) {
        let card = document.createElement("div");
        card.className = "card";
        let postoffice = PostOffice[i];
        card.innerHTML = `
                    <div>Name: <span>${postoffice.Name}</span></div>
                    <div>Branch Type: <span>${postoffice.BranchType}</span></div>
                    <div>Delivery Status: <span>${postoffice.DeliveryStatus}</span></div>
                    <div>District: <span>${postoffice.District}</span></div>
                    <div>Division: <span>${postoffice.Division}</span></div>
                    `
        div.append(card);
    }
}

function inputChanged() {
    filter();
}

function filter() {
    let postoffices = [];

    let input = document.getElementById("input");
    let inputtext = input.value.toUpperCase();
    let n = inputtext.length;

    for (let i = 0; i < Postoffice.length; i++) {
        let name = Postoffice[i].Name.toUpperCase().substring(0, n);
        if (name == inputtext) {
            postoffices.push(Postoffice[i]);
        }
    }

    loadareas(postoffices);

}