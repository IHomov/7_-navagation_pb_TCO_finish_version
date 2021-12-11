const URL = '/tso-data-pb.json';
let tsoList = await fetch(URL);
    tsoList = await tsoList.json();
    tsoList = tsoList.devices;

//  DOM elements
let outList = document.getElementById('term-location');
let BtnNear = document.getElementById('btn-near');

// event handler
BtnNear.addEventListener('click', () => {
    removeField();
    getLocation();
})

// determining the location of coordinates
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(CurrentPosition);
    }
    return null;
};

function CurrentPosition(position) {
    let userLat = position.coords.latitude;
    let userLon = position.coords.longitude;
    
    for(let tso of tsoList){
        tso.distance = distance(userLat, userLon, tso.longitude, tso.latitude);
    
    }
    let sorted = tsoList.sort((a, b) => a.distance - b.distance).slice(0, 5);

    console.log("Массив с рассчитанным расстояние:", tsoList);
    console.log('Отсортированный массив', sorted);
    
    OutputData(sorted); //data output to the page

    var map;
        DG.then(function () {
            map = DG.map('map', {
                center: [userLat, userLon],
                zoom: 30
            });

            for(let item of sorted){    
                DG.marker([item.latitude, item.longitude]).addTo(map).bindPopup(`${item.placeRu}`);
            }
        });
    console.log(`latitude ${userLat}; longitude ${userLon}`);
}

function deg2rad(num) {
return num * Math.PI / 180;
}

// calculate the distance between two coordinates
function distance(lat_1, lon_1, lat_2, lon_2) {
	var radius_earth = 6371; // Радиус Земли
	var lat_1 = deg2rad(lat_1),
		lon_1 = deg2rad(lon_1),
		lat_2 = deg2rad(lat_2),
		lon_2 = deg2rad(lon_2);
    var d = 2 * radius_earth * Math.asin(Math.sqrt(Math.sin((lat_2 - lat_1) / 2) ** 2 + Math.cos(lat_1) * Math.cos(lat_2) * Math.sin((lon_2 - lon_1) / 2) ** 2));
	return d.toFixed(2) * 1000;
};

// data output to the page
function OutputData(a) {
    outList.innerHTML += a.map((item, i) =>
    
    `       <div text-center mt-5">
                    <p>${i+1}. <b>${item.fullAddressRu}</b>, ${item.placeRu}, ${item.distance}м.</p>
            </div>
            
        `).join('');
}

function removeField() {
    outList.innerHTML = '';
}