var energyUnits = ["Wh","J"];
var enduranceUnits = ["hrs","min"]

//runCalcs();

initBatteryTable();

function runCalcs() {
	var voltageInput = Qty.parse(document.getElementById("voltageInput").value);
	var capacityInput = Qty.parse(document.getElementById("capacityInput").value);

	var goodForm = true;

	if ( voltageInput == null || !(voltageInput.kind() == 'potential') ) {
		document.getElementById("voltageInputGroup").classList.remove("has-success");
		document.getElementById("voltageInputGroup").classList.add("has-error");
		document.getElementById("voltageInputIcon").classList.remove("fa-check");
		document.getElementById("voltageInputIcon").classList.add("fa-times");
		
		goodForm = false;
	}

	if ( capacityInput == null || !(capacityInput.kind() == 'charge' ) ) {
		document.getElementById("capacityInputGroup").classList.remove("has-success");
		document.getElementById("capacityInputGroup").classList.add("has-error");
		document.getElementById("capacityInputIcon").classList.remove("fa-check");
		document.getElementById("capacityInputIcon").classList.add("fa-times");
		
		goodForm = false;
	}

	if ( goodForm ) {		
		document.getElementById("voltageInputGroup").classList.remove("has-error");
		document.getElementById("voltageInputGroup").classList.add("has-success");
		document.getElementById("voltageInputIcon").classList.remove("fa-times");
		document.getElementById("voltageInputIcon").classList.add("fa-check");

		document.getElementById("capacityInputGroup").classList.remove("has-error");
		document.getElementById("capacityInputGroup").classList.add("has-success");
		document.getElementById("capacityInputIcon").classList.remove("fa-times");
		document.getElementById("capacityInputIcon").classList.add("fa-check");

		calculate();
	}
}

function calculate() {

	var voltageInput = Qty.parse(document.getElementById("voltageInput").value);
	var capacityInput = Qty.parse(document.getElementById("capacityInput").value);

	var rawVoltage;
	var rawCapacity;
	var input;

	rawVoltage = Number(voltageInput.toString('V').replace(/[^0-9.,]\w+/g, ''));
	rawCapacity = Number(capacityInput.toString('Ah').replace(/[^0-9.,]\w+/g, ''));


	var energy;
	var rawEnergy;

	energy = new Qty(rawVoltage*rawCapacity+" Wh");
	rawEnergy = rawVoltage*rawCapacity;

	var energyTableHTML = '';

	for ( i = 0 ; i < energyUnits.length ; i++ ) {
		energyTableHTML += '<tr><td>'+energy.to(energyUnits[i]).toPrec(0.01).toString()+'</td></tr>';
	}

	document.getElementById("energyTableContent").innerHTML = energyTableHTML;

	var enduranceData = new google.visualization.DataTable();
	var t100Data = new google.visualization.DataTable();
	var t200Data = new google.visualization.DataTable();

	enduranceData.addColumn('number', 'Average Power Draw (W)');
	enduranceData.addColumn('number', 'Endurance (min)');

	t100Data.addColumn('number', 'Average Static Thrust (lbf)');
	t100Data.addColumn('number', 'Endurance (min)');

	t200Data.addColumn('number', 'Average Static Thrust (lbf)');
	t200Data.addColumn('number', 'Endurance (min)');

	var data = [];
	var dataT100 = [];
	var dataT200 = [];

	for ( var i = 20 ; i < 500 ; i += 5 ) {
		data.push([i,rawEnergy/i*60]);
	}

	for ( var i = -6 ; i < 6 ; i += 0.1 ) {
		if ( Math.abs(i) < 0.3 ) { 
			dataT100.push([i,null]);
		} else {
			var power = getT100Power(i);
			dataT100.push([i,rawEnergy/power*60]);
		}
	}

	for ( var i = -11 ; i < 12 ; i += 0.1 ) {
		if ( Math.abs(i) < 0.2 ) { 
			dataT200.push([i,null]);
		} else {
			var power = getT200Power(i);
			dataT200.push([i,rawEnergy/power*60]);
		}
	}

	enduranceData.addRows(data);
	t100Data.addRows(dataT100);
	t200Data.addRows(dataT200);

	var chartEndurance = new google.visualization.LineChart($('#chartEndurance').get(0));
	var chartT100 = new google.visualization.LineChart($('#chartT100').get(0));
	var chartT200 = new google.visualization.LineChart($('#chartT200').get(0));

	chartEndurance.draw(enduranceData, {
		title: 'Endurance',
		vAxis: {
			'title': 'Endurance (min)'
		},  
		hAxis: {
			'title': 'Average Power Draw (W)'
		},  
		'height': 300,
		colors: ['#2699D0'],
		backgroundColor: { fill:'transparent' },
		legend: {position: 'none'}
	});
	chartT100.draw(t100Data, {
		title: 'T100 Endurance vs. Thrust',
		vAxis: {
			'title': 'Endurance (min)'
		},  
		hAxis: {
			'title': 'Thrust (lbf)'
		},  
		'height': 300,
		colors: ['#2699D0'],
		backgroundColor: { fill:'transparent' },
		legend: {position: 'none'},
		interpolateNulls: false
	});
	chartT200.draw(t200Data, {
		title: 'T200 Endurance vs. Thrust',
		vAxis: {
			'title': 'Endurance (min)'
		},  
		hAxis: {
			'title': 'Thrust (lbf)'
		},  
		'height': 300,
		colors: ['#2699D0'],
		backgroundColor: { fill:'transparent' },
		legend: {position: 'none'},
		interpolateNulls: false
	});
}

function getT100Power(thrust) {
	var a=5.788;
	var b=-6.617;
	var c=8.799;
	var d=-0.2524 ;
	var e=-0.05307 ;

	var x = thrust;

	return a+b*x+c*Math.pow(x,2)+d*Math.pow(x,3)+e*Math.pow(x,4);
}

function getT200Power(thrust) {
	var a=10.78;
	var b=-2.812;
	var c=4.094;
	var d=-0.03269;
	var e=-0.007458;

	var x = thrust;

	return a+b*x+c*Math.pow(x,2)+d*Math.pow(x,3)+e*Math.pow(x,4);
}


function setDensity(density) {
	document.getElementById("weightInput").value = density;
	runCalcs();
}

function loadJSON(callback) {   

  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', '/calc/batteryData.json', true);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}

function initBatteryTable() {
	var batteryTableHTML = '';

 	loadJSON(function(response) {
  // Parse JSON string into object
    var data = JSON.parse(response);
    console.log(data);

    data["batterys"].forEach(function(item){
    	var matDensity = Qty(item.density);

    	batteryTableHTML += "<tr><td>";
    	if ( item.link != undefined ) {
    		batteryTableHTML += "<a href='"+item.link+"'>";
    		batteryTableHTML += item.name;
    		batteryTableHTML += "</a>";
    	} else {
    		batteryTableHTML += item.name;
    	}
    	batteryTableHTML += "</td><td>";
    	batteryTableHTML += "<a href='javascript:void' onclick='setDensity(\""+matDensity.to("kg/m3").toPrec(0.01).toString()+"\")'>";
    	batteryTableHTML += matDensity.toString("kg/m3");
    	batteryTableHTML += "</a></td><td>";
    	batteryTableHTML += "<a href='javascript:void' onclick='setDensity(\""+matDensity.to("lb/ft3").toPrec(0.01).toString()+"\")'>";
    	batteryTableHTML += matDensity.to("lb/ft3").toPrec(0.01).toString();
    	batteryTableHTML += "</a></td></tr>\n";

		});

		document.getElementById("batteryTableContent").innerHTML = batteryTableHTML;
 });
}

// load chart lib
google.load('visualization', '1', {
  packages: ['corechart']
});

// call drawChart once google charts is loaded
google.setOnLoadCallback(calculate);