/*	Kyle Martens
	Section AF
	homework 9

	*/

(function () {
	"use strict";
	var URL = "https://webster.cs.washington.edu/cse154/babynames.php";

	window.onload = function () {
		var loadNames = document.getElementById("allnames");
		loadNames.onload = getAjax('GET', getNames, "?type=list");

		var searchButton = document.getElementById("search");
		searchButton.onclick = search;
		
	}

	function getAjax (method, destination, queryUrl) {
		var ajax = new XMLHttpRequest();
		ajax.onload = destination;
		ajax.open(method, URL + queryUrl, true);
		ajax.send();
	}

	function getNames() {
		toggleDisplay(document.getElementById("loadingnames"));
		if(this.status == 200){
			var namesBox = document.getElementById("allnames");
			var names = this.responseText.split("\n");
			namesBox.disabled = false;
			for (var i = 0; i < names.length; i++) {
				var nameOption = document.createElement("option");
				nameOption.innerHTML = names[i];
				nameOption.value = names[i];
				namesBox.appendChild(nameOption);
			}
		}
	}
	
	function clearPrevSearches(){
		document.getElementById("loadinggraph").innerHTML = "";
		document.getElementById("loadingcelebs").innerHTML = "";
	}

	function search(){
		toggleDisplay(document.getElementById("resultsarea"));
		var name = document.getElementById("allnames").value;
		var genderm = document.getElementById("genderm");
		if(genderm.checked) {
			var gender = genderm.value;
		} else {
			var gender = document.getElementById("genderf").value;
		}
		
		getAjax('GET', getMeaning, "?type=meaning&name=" + name);
		getAjax('GET', getRank, "?type=rank&name=" + name + "&gender=" + gender);
		getAjax('GET', getCelebs, "?type=celebs&name=" + name + "&gender=" + gender);		
	}

	function getMeaning(){
		toggleDisplay(document.getElementById("loadingmeaning"));
		if(this.status == 200){
			var meaningArea = document.getElementById("meaning");
			meaningArea.innerHTML = this.responseText;
		}
	}

	function getRank(){
		toggleDisplay(document.getElementById("loadinggraph"));
		if(this.status == 200){
			var graphArea = document.getElementById("graph");
			var ranks = this.responseXML.querySelectorAll("rank");
			var row1 = document.createElement("tr");
			var row2 = document.createElement("tr");
			
			for (var i = 0; i < ranks.length; i++) {
				var year = document.createElement("th");
				year.innerHTML = ranks[i].getAttribute("year");
				row1.appendChild(year);

				var rankCol = document.createElement("td");
				var rankDiv = document.createElement("div");
				var rank = ranks[i].textContent;
				var barHeight = parseInt((1000 - rank) / 4) + "px";
				rankDiv.style.height = barHeight;
				if(rank == 0){
					rankDiv.style.height = 0;
				} else if(rank <= 10) {
					rankDiv.style.color = "red";
				}
				var rankData = rank;
				rankDiv.innerHTML = rankData;
				rankCol.appendChild(rankDiv);
				row2.appendChild(rankCol);
			}
			graphArea.appendChild(row1);
			graphArea.appendChild(row2);
		}
	}

	function getCelebs(){
		toggleDisplay(document.getElementById("loadingcelebs"));
		if(this.status == 200){
			var celebsArea = document.getElementById("celebs");
			var data = JSON.parse(this.responseText).actors;
			for(var i = 0; i < data.length; i++){
				var li = document.createElement("li");
				li.innerHTML = data[i].firstName + " " + data[i].lastName + " (" +
								data[i].filmCount + " films)";
				celebsArea.appendChild(li);
			}
		}
	}

	function ajaxSuccess(result){
		return result.status == 200;
	}

	function toggleDisplay(display) {
		if (display.style.display) {
			display.style.display = "";
		} else {
			display.style.display = "none";
		}
	}

})();