function renderSpace() {

	var stationsNr = document.getElementById("stationsNr").value
	if (stationsNr < 1)
		return;

	var existingNr = document.getElementById('gamaRatios').rows[0].cells.length - 1
	if (stationsNr == existingNr)
		return;

	renderGamaRatiosTable(stationsNr, existingNr);
	renderTransportationCostTable(stationsNr, existingNr);
}

/////////////////////////////////////////////////////////////////
//////////////          RENDER TABLES             ///////////////
/////////////////////////////////////////////////////////////////
function renderTransportationCostTable(stationsNr, existingNr) {
	//console.log(existingNr)
    var table = document.getElementById("transportationCost");
    renderedColumnsNumber = existingNr;
    renderedRowsNumber = existingNr;

    if (stationsNr > existingNr) {

    	while(stationsNr != renderedColumnsNumber) {
    		addColumn(table, renderedColumnsNumber);
    		renderedColumnsNumber++;
    	}

    	while (stationsNr!= renderedRowsNumber) {
    		addTableRowLeft(table, renderedRowsNumber)
    		renderedRowsNumber++;
    	}
    } else {
    	while(stationsNr != renderedColumnsNumber) {
    		deleteColumn(table);
    		renderedColumnsNumber--;
    	}
    	while(stationsNr  != renderedRowsNumber) {
    		deleteTableRow(table);
    		renderedRowsNumber--;
    	}
    }
}

function renderGamaRatiosTable(stationsNr, existingNr) {

	//console.log(existingNr)
    var table = document.getElementById("gamaRatios");
    renderedColumnsNumber = existingNr;
    if (stationsNr > existingNr) {
    	while(stationsNr != renderedColumnsNumber) {
    		addColumn(table, renderedColumnsNumber);
    		renderedColumnsNumber++;
    	}
    } else {
    	while(stationsNr != renderedColumnsNumber) {
    		deleteColumn(table);
    		renderedColumnsNumber--;
    	}
    }
}

function addColumn(t, n) {
	row0 = t.rows[0];
	cellInd = row0.cells.length;

    var cell1 = row0.insertCell(cellInd);
    cell1.style.textAlign = "center";
	cell1.style.fontWeight = "bold";
    cell1.innerHTML = (n+1);

    for (i = 1; i < t.rows.length; i++) {
    	var cell2 = t.rows[i].insertCell(cellInd);
    	cell2.innerHTML = "<input type=\"text\" style=\"width: 25px;\" value=\"0\" />";
    }
}

function deleteColumn(t) {
	var deleteIndex = t.rows[0].cells.length - 1
	for (i = 0; i < t.rows.length; i++)
    	t.rows[i].deleteCell(deleteIndex);
}

function addTableRowLeft(t, n) {
	var stationsNr = document.getElementById("stationsNr").value;
	console.log("hop " + stationsNr + " " + n)
	var row = t.insertRow(n+1);//maybe refactor
	var cell1 = row.insertCell(0);
	cell1.style.textAlign = "right";
	cell1.style.paddingRight = "5px";
	cell1.style.fontWeight = "bold";
	cell1.innerHTML = n;
	for (i = 1; i <= stationsNr; i++) {
		console.log("hop1 " + i)
		var cell2 = row.insertCell(i);
		if(i<stationsNr){
			cell2.innerHTML = "<input type=\"text\" style=\"width: 25px;\" value=\"X\" readOnly/>";
		}else{
			cell2.innerHTML = "<input type=\"text\" style=\"width: 25px;\" value=\"0\"/>";
			
		}
	}
}

function addTableRowRight(t, n) {
	var stationsNr = document.getElementById("stationsNr").value;
	console.log("hop " + stationsNr + " " + n)
	var row = t.insertRow(n+1);//maybe refactor
	var cell1 = row.insertCell(0);
	cell1.style.textAlign = "right";
	cell1.style.paddingRight = "5px";
	cell1.style.fontWeight = "bold";
	cell1.innerHTML = n;
	for (i = 1; i <= stationsNr; i++) {
		console.log("hop2 " + i)
		var cell2 = row.insertCell(i);
			cell2.innerHTML = "<input type=\"text\" style=\"width: 25px;\" value=\"0\"/>";
	}
}

function deleteTableRow(t) {
	var deleteIndex = t.rows.length - 1
	t.deleteRow(deleteIndex);
}

/////////////////////////////////////////////////////////////////
//////////////        COLECT TABLE DATA           ///////////////
/////////////////////////////////////////////////////////////////
function getCostsInputValues() {
    var table = document.getElementById("transportationCost");

    var costs = malloc2d(table.rows.length - 1);
    for (i = 1; i < table.rows.length; i++) {
    	for (j = 1; j < table.rows[0].cells.length; j++) {
    		costs[ i - 1 ] = costs[ i - 1 ] || [];
    		costs[ i - 1 ].push(parseFloat(table.rows[i].cells[j].children[0].value));
    		//console.log(i + ", " + j + " = " + table.rows[i].cells[j].children[0].value);
    	}
    }
	//console.log(costs);
	//update values bellow main diagonal with elements above.

	for (i = 1; i < costs.length - 1; i++) {
    	for (j = i; j < costs[0].length - 1; j++) {
			//costs[j - 1][i - 1] = costs[i - 1][j];
			//console.log(i + ", " + j + " = " + costs[i][j]);
			costs[j + 1][i - 1] = costs[i][j];
		}
	}
	
	//console.log(costs);

    return costs;
}

function getGamaValues() {
    var table = document.getElementById("gamaRatios");

    var gamas = [];
    for (i = 1; i < table.rows[0].cells.length; i++) {
    	gamas[i-1] = parseFloat(table.rows[1].cells[i].children[0].value);
    }
    return gamas;
}

/////////////////////////////////////////////////////////////////
////////      CHANGE A & B ACCORDING TO ALGORITM        /////////
/////////////////////////////////////////////////////////////////

function onAlgorithSelectChange() {
	var alg = document.getElementById("algorithmSelect");
	algSw = alg.value;
	valueA = document.getElementById("valueA");
	valueB = document.getElementById("valueB");
	switch (algSw) {
		//Kruskal
		case "1" :
			valueA.value = 0;
			valueB.value = 0;
			break;
		//Prim
		case "2" :
			valueA.value = "0, -" + Infinity.toLocaleString() + ",..";
			valueB.value = 1;
			break;
		//Esau-Williams
		case "3" :
			valueA.value = 1;
			valueB.value = 1;
			break;
	}
}

function getValueA() {
	return parseFloat(document.getElementById("valueA").value);
}

function getValueB() {
	return parseFloat(document.getElementById("valueB").value);
}

function getValueGama() {
	return parseFloat(document.getElementById("gama").value);
}

function onchangeValues(){
	document.getElementById("algorithmSelect").value=0;
}

function doComputation() {
	debug=false;
	if(debug) {
		stationsNr=5;
		C=[[1,2,3,4,5],
		   [0,4,3,5,3],
		   [4,0,3,4,2],
		   [3,3,0,2,3],
		   [5,4,2,0,2]];
		gamma =[1,1,1,2,2];
		W=[1,0,4,3,5];
		G=3;
	}else {
	var stationsNr = document.getElementById("stationsNr").value;
	var C = getCostsInputValues();
	var G = getValueGama();
	var gamma = getGamaValues();
	var a = getValueA();
	var b = getValueB();
	var algType = getAlg();
	//count weights
	var W = countWeights(stationsNr, a, b, algType, C);
	//console.log(C);
	//console.log(W);
	}
	//count transport matrix
	var T = malloc2d(stationsNr);
	for (var i = 0; i < stationsNr; i++) {
		for(var j = 0; j < stationsNr; j++){
			T[i].push(C[i][j] - W[i]);
		}
	}
	
	allConections = [];
	allConectionsWithoutCenter = [];
	channels = [];

	for(var i = 0; i <= stationsNr; i++){
		allConections.push(i);
		if(i < stationsNr) {
			allConectionsWithoutCenter.push(i);
		}
	}
	
	var idx;

	interation = 1;
	while (true) {
		console.log("Iteration - " + (interation++));
		idx = getMinIdx(T);
		console.log(idx)
			
		if (idx[0] == -1 || areArrayValuesEqual(allConections)) { break; }

		T[idx[0]][idx[1]] = Infinity;

		if (validateNewChannel(idx, allConections, allConectionsWithoutCenter, G, gamma)) {
			updateConnections(idx, allConectionsWithoutCenter, allConections, channels)
			updateTMatrix(algType, W, idx, T, C)
			if(debug) {
				console.log(allConectionsWithoutCenter)
				console.log(allConections)
				console.log(channels)	
			}
		}
	}
	responseTable = malloc2d(stationsNr);
	for(var i = 0 ; i < responseTable.length; i++) {
		for(var j = 0 ; j < stationsNr; j++) {
			responseTable[i].push(0);
		}
	}
	for(var i = 0 ; i < channels.length; i++) {
		responseTable[channels[i][0]][channels[i][1]]=1;
	}	
	renderResults(responseTable);

}	

function renderResults(responseTable){

	// var $table = document.getElementById("resultingConnections");
	var $table = $('#resultingConnections');
	$table.attr('border', 1)
	$table.empty()
	// for (var i = 2; i < responseTable.length; i++) {
	// 	//addColumn(table, i)
	// 	console.count("for");
	// }
	var tr = $('<tr>')
	tr.append('<td>&nbsp;</td>')
	for (var j = 0; j < responseTable[0].length; j++) {
		var td = $('<td>'+eval(j+1)+'</td>')
		tr.append(td)
	}
	$table.append(tr)
	for (var i = 0; i < responseTable.length; i++) {
		var tr = $('<tr>');
		tr.append('<td>'+ i +'</td>')
		for (var j = 0; j < responseTable[i].length; j++) {
			var td = $('<td>'+responseTable[i][j]+'</td>')
			tr.append(td)
		}
		$table.append(tr);
	}

	// for (i = 2; i < table.rows.length; i++) {
 //     	deleteColumn(table);
	// 	deleteTableRow(table);
 //    }
	// for (i = 0; i < responseTable.length-1; i++) {
 //     	addColumn(table, i);
	// 	addTableRowRight(table, i);
 //    }
	//  for (i = 1; i < table.rows.length; i++) {
 //    	for (j = 1; j < table.rows[0].cells.length; j++) {
 //    		table.rows[i].cells[j].children[0].value = responseTable[i-1][j];
 //    	}
 //    }

}

function updateTMatrix(algType, W, idx, T, C){
	var i = idx[0]-1;
	if(i > -1){
		if(algType == 2){
			W[i] = 0;
		} else {
			W[i] = W[idx[1]];
		}
		for(var j = 0;j < T[i].length;j++){
			if(j != idx[1]){
				T[i][j] = C[i][j] - W[i];
			}
		}
	}
}
function areArrayValuesEqual(arr) {
	for (var i = 1; i < arr.length; i++) {
		if (arr[0] != arr[i]) return false;
	}
	return true;
}

function countWeights(stationsNr, a, b, algType, C) {
	var W = [];
	if (algType == 2) {
		W.push(0);
		for (var i = 1; i < stationsNr; i++) {
			W.push(Infinity);
		}
	} else {
		for (var i = 0; i < stationsNr; i++) {
			W.push(a * (b * C[0][i] + (1 - b) * minimalValue(i - 1,C[i])));
		}
	}
	return W;
}


function minimalValue(idx, arr) {
	
	//console.log(idx);

	//console.log(arr);

	min = Infinity;
	for (i = 0; i < arr.length; i++) {
		if (min > arr[i]) {
			if (i != idx) {
				min = arr[i];
			}
		}
	}
	//console.log(min)
	return min;
}

function getAlg() {
	document.getElementById("algorithmSelect").value;
}

function getMinIdx(T) {
	var minI = -1;
	var minJ = -1;
	var minV = Infinity;
	for (var i = 0; i < T.length; i++) {
		for (var j = i + 1; j < T.length; j++) {
			if (minV > T[i][j]) {
				minI = i ;
				minJ = j ;
				minV =  T[i][j]; 
			}
		}
	}
	return [minI, minJ];
}
	
function validateNewChannel(idx, allConections, allConectionsWithoutCenter, G, gamma){
	
	//check for loops
	
	if (allConections[idx[0]] == allConections[idx[1] + 1] ) {
		return false;
	} else {
	// check if gamma for a group is not too big 
		var GS ;
		if(idx[0] > 0) {
			GS= computeSumOfIdxArr(getIdxEqualwithVal(allConectionsWithoutCenter, idx[0] - 1), gamma);
		}
		GS += computeSumOfIdxArr(getIdxEqualwithVal(allConectionsWithoutCenter, idx[1]), gamma);
		if (GS > G) {
			return false;
		}
	}
	return true;
}


function getIdxEqualwithVal(arr, val) {
	var idxArr =[]
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == arr[val]) {
			idxArr.push(i);
		}
	}
	return idxArr;
}
	
function computeSumOfIdxArr(idxVals, arr){
	var s = 0;
	for(var i = 0; i < idxVals.length; i++){
		s += arr[idxVals[i]]
	}
	return s;
}

function updateConnections(idx, allConectionsWithoutCenter, allConections, channels) {
	if(idx[0] != 0) {
		secondGroup = getIdxEqualwithVal(allConectionsWithoutCenter, idx[1]);
		var valueToChange = allConectionsWithoutCenter[idx[0] - 1];
	
		for (var i = 0 ; i < secondGroup.length; i++ ) {
			allConectionsWithoutCenter[secondGroup[i]] = valueToChange;
		}
	}	
		
	valueToChange = allConections[idx[0]];
	secondGroup = getIdxEqualwithVal(allConections, idx[1]+1);
	for (var i = 0 ; i < secondGroup.length; i++ ) {
		allConections[secondGroup[i]] = valueToChange;
	}

	channels.push(idx);
}
	
function malloc2d(n){
	var arr = [];
	for(var i = 0; i < n; i++){
  		arr.push([])
	}
	return arr;
}