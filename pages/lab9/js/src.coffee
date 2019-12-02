cleanup = (e) ->
    if not $.isNumeric($(e.currentTarget).val())
        $(e.currentTarget).val ''
        toastr.error('Se acceptă doar valori numerice.')
    else
        $(e.currentTarget).trigger('valid')

valid = ->
    if not $.isNumeric(cNum = parseInt($('#concentrators').val()))
        toastr.error 'Introdu o valoare numerică în cîmpul "Numărul de concentratoare".'
        $('#concentrators').focus()
        return false
    if not $.isNumeric(sNum = parseInt($('#stations').val()))
        toastr.error 'Introdu o valoare numerică în cîmpul "Numărul de staţii".'
        $('#stations').focus()
        return false
    if not $.isNumeric(parseInt($('#maxStations').val()))
        $('#maxStations').focus()
        toastr.error 'Introdu o valoare numerică în cîmpul "Numărul maxim de staţii la un concentrator".'
        return false
    matrix = parseCostMatrix()
    for vector in matrix
        if vector.length isnt sNum
            $('#costs-table').focus()
            toastr.error 'Introdu corect "Matricea costurilor conectării staţiilor la centru şi concentratoare".'
            return false
        else
            for element in vector
                if not $.isNumeric(parseFloat(element))
                    $('#costs-table').focus()
                    toastr.error 'Introdu doar valori numerice în "Matricea costurilor conectării staţiilor la centru şi concentratoare".'
                    return false

    if matrix.length isnt cNum + 1
        $('#costs-table').focus()
        toastr.error 'Introdu corect "Matricea costurilor conectării staţiilor la centru şi concentratoare".'
        return false

    costVector = parseCostVector()
    if costVector.length isnt cNum + 1
        $('#concentrators-table').focus()
        toastr.error 'Introdu corect "Vectorul costurilor conectării concentratoarelor".'
        return false

    for element in costVector
        if not $.isNumeric(parseFloat(element))
            $('#concentrators-table').focus()
            toastr.error 'Introdu doar valori numerice în "Vectorul costurilor conectării concentratoarelor".'
            return false
    true

parseCostMatrix = ->
    $('#costs-table').val().split("\n").map (row) -> row.split(' ').map(parseFloat)

parseCostVector = ->
    $('#concentrators-table').val().split(' ').map(parseFloat)

cleanTable = ->
    $('.station, .result-row', '#result-table').remove()
    $('#minimal-cost').text ''
    $('#result').addClass('hidden')

drawTable = (x, y, values, cost) ->
    return if x < 1 or y < 1
    cleanTable()
    $('#minimal-cost').text cost
    $('#result').removeClass('hidden')

    html = ""
    for num in [1..x]
        html += "<th class='station text-center'>Statia #{num}</th>"
    $('#result-table thead tr').append html

    html = """
        <tr class='result-row'>
            <td>Centru</td>
        """
    for numX in [1..x]
        html += "<td id='result-#{numX}-0'>#{values[0][numX-1]}</td>"

    for numY in [1..y]
        html += "<tr class='result-row'>"
        html += "<td>Concentrator #{numY}</td>"
        for numX in [1..x]
            html += "<td id='result-#{numX}-#{numY}'>#{values[numY][numX-1]}</td>"
        html += "</tr>"
    $('#result-table tbody').append html

calculate = ->
    n = parseInt $('#concentrators').val()
    m = parseInt $('#stations').val()
    max = parseInt $('#maxStations').val()
    c = parseCostMatrix()
    f = parseCostVector()
    x = []
    arr = []
    for numM in [1..m]
        arr.push 1
    x.push arr
    for numN in [1..n]
        arr = []
        for numM in [1..m]
            arr.push 0
        x.push arr

    y = [1]

    for numN in [1..n]
        y.push 0

    n++

    cost = calculateCost(n, m, c, f, x, y)

    d = []

    for i in [0..n-1]
        d[i] = []
        for j in [0..n-1]
            d[i][j] = []
            for k in [0..m-1]
                d[i][j][k] = c[i][k] - c[j][k]

    B = [1..y.length-1]
    L = []
    Z = []
    iCost = cost

    for row in x
        Z.push row.slice()
    connectedStations = []

    while B.length
        foundBetterCost = false
        A = y.slice()

        for s in [0..B.length-1]
            js = B[s]
            A[js] = 1

            found = getMaximalDifference(js, d, max, n, m, connectedStations, y)

            for station in found
                Z[0][station.k] = 0
                Z[js][station.k] = 1

            costPrim = calculateCost(n, m, c, f, Z, A)

            if costPrim < iCost
                foundBetterCost = s:s, js:js, found:found
                iCost = costPrim
                L.push(js)

            # Reset temporary vars
            A = y.slice()
            Z = []
            for row in x
                Z.push row.slice()

        if iCost >= cost
            break
        else
            y[B[foundBetterCost.s]] = 1
            B.splice(foundBetterCost.s, 1)
            cost = iCost
            for station in foundBetterCost.found
                x[0][station.k] = 0
                x[foundBetterCost.js][station.k] = 1

            for station in foundBetterCost.found
                connectedStations.push station.k

    [x, cost]

getMaximalDifference = (s, d, max, n, m, connectedStations, y) ->
    found = []
    for k in [0..m-1]
        if d[0][s][k] > 0
            found.push
                s: s
                k: k
                value: d[0][s][k]

    if found.length > max
        usedStations = connectedStations.slice()
        sortedFound = []
        found.sort (a, b) -> b.value - a.value
        for station in found
            if station.k not in usedStations
                usedStations.push station.k
                sortedFound.push station
        found = sortedFound.slice(0, max)

    found

calculateCost = (n, m, c, f, x, y) ->
    cost = 0;
    for i in [0..n-1]
        cost += y[i] * f[i]
        for j in [0..m-1]
            cost += x[i][j] * c[i][j]
    cost

$ ->
    $('[data-toggle="tooltip"]').tooltip()
    stations = $('#stations').on 'change', cleanup
    maxStations = $('#maxStations').on 'change', cleanup
    concentrators = $('#concentrators').on('change', cleanup).on 'valid', (e) ->
        $('#costs-table').attr 'rows', parseInt($(e.currentTarget).val()) + 1
        $('#concentrators-table').attr 'rows', parseInt($(e.currentTarget).val()) + 1

    $('#calculate').on 'click', (e) ->
        e.preventDefault()
        $('#interface').submit()
        false

    $('#interface').on 'submit', (e) ->
        e.preventDefault()
        if valid()
            [connections, cost] = calculate()
            drawTable stations.val(), concentrators.val(), connections, cost
        false
