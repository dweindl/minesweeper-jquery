// DW minesweeper 2016

function getEmptyGrid(rows, cols) {
    var grid = []; 
    var row = [];
    
    for(var i = 0; i < cols; ++i) {
        row.push(0);
    }
    
    for(var i = 0; i < rows; ++i) {
        grid.push(row.slice(0));
    }
    
    return grid;
}

function placeMines(grid, mines) {
    for(var i = 0; i < mines; ++i) {
        var placed = false;
        do {
            var row = Math.floor(Math.random() * grid.length);
            var col = Math.floor(Math.random() * grid[0].length);
            
            if(grid[row][col] >= 0) {
                grid[row][col] = -1;
                incrementNeighbors(grid, row, col);
                placed = true;
            }
        } 
        while (!placed);
    }
}

function getNeighbors(grid, row, col) {
    var neighbors = [
        [row - 1, col - 1],
        [row - 1, col],
        [row - 1, col + 1],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col - 1],
        [row + 1, col],
        [row + 1, col + 1]
    ];
    
    var validNeighbors = [];
    
    for(var i = 0; i < neighbors.length; ++i) {
        var row = neighbors[i][0];
        var col = neighbors[i][1];
    
        if(row < 0 || row >= grid.length)
            continue;
    
        if(col < 0 || col >= grid[0].length)
            continue;

        validNeighbors.push(neighbors[i]);
    }
    
    return validNeighbors;
}

function incrementNeighbors(grid, row, col) {
    neighbors = getNeighbors(grid, row, col);
    
    for(var i = 0; i < neighbors.length; ++i) {
        var row = neighbors[i][0];
        var col = neighbors[i][1];
    
        if(grid[row][col] < 0)
            continue;
        
        grid[row][col] += 1;
    }
}


function showGrid(grid) {
    html = "";
    for(var i = 0; i < grid.length; ++i) {
        html += getHtmlRowRow(grid[i], i);
    }
    $('#tblGrid tbody').remove();
    $('#tblGrid').append(html);
}

function getHtmlRowRow(row, rowIdx) {
    html = "";
    for(var j = 0; j < row.length; ++j) {
        var num = row[j];
 
        if(num < 0)
            num = "*";
        
        if(num == 0) 
            num = "&nbsp;";

        var fieldId = getFieldId(rowIdx, j);
        var link = '<span class="not">' + num + '</span>';
        html += '<td id="' + fieldId + '" class="hidden">&nbsp;' + link + '&nbsp;</td>';
    }
    return '<tr>' + html + '</tr>';
}

function getFieldId(row, col) {
    return "field-" + row + "-" + col;
}

function fieldClicked(row, col) {
    
    var field = $('#' + getFieldId(row, col));
    
    revealField(myMS.grid, row, col);

    if(field.hasClass('mine')) {
        $("#youlose").removeClass("not");
        myMS.gameover = true;
        return;
    }    
           
    if(hasWon()) {
        $("#youwin").removeClass("not");
        myMS.gameover = true;
        return;
    }
}

function hasWon() {
    for(var i = 0; i < myMS.grid.length; ++i) {
        for(var j = 0; j < myMS.grid[0].length; ++j) {
            if(myMS.grid[i][j] >= 0 && $('#' + getFieldId(i, j)).hasClass("hidden"))
                return false;            
        }
    }
        
    return true;
}

function revealField(grid, row, col) {
    var field = $('#' + getFieldId(row, col));
    if(!field.hasClass("hidden"))
        return;
        
    field.removeClass('hidden');
    field.addClass(getRevealedClass(grid[row][col]));
    field.children().addClass(getRevealedClass(grid[row][col]));
    field.children().removeClass("not");
    
    if(grid[row][col] == 0)
        revealNeighbors(grid, row, col);
}

function revealNeighbors(grid, r, c) {
    var neighbors = getNeighbors(grid, r, c);
    for(var i = 0; i < neighbors.length; ++i) {
        var row = neighbors[i][0];
        var col = neighbors[i][1];
        revealField(grid, row, col);
    }
}

function getRevealedClass(val) {
    var c = "mine";
    if(val >= 0)
        c = val + c;
    return c;
}

function newGame(game) {
    var games = {
        "beginner" : {"rows" : 10, "cols" : 10, "mines" : 10},
        "amateur"  : {"rows" : 15, "cols" : 15, "mines" : 20},
        "profi"    : {"rows" : 20, "cols" : 30, "mines" : 99}
    };
    
    game = games[game];
    
    $("#youlose").addClass("not");
    $("#youwin").addClass("not");
    
    myMS = {};
    myMS.gameover = false;
    myMS.grid = getEmptyGrid(game["rows"], game["cols"]);
    placeMines(myMS.grid, game["mines"]);
    showGrid(myMS.grid);
}

$(document).ready(function () {
    newGame("beginner");
    
    $('#tblGrid').click(function (evt) {
        evt.preventDefault();

        if(myMS.gameover) return;
        
        // field-row-col
        var field = $(evt.target).closest('td').attr("id").split('-');
        fieldClicked(parseInt(field[1]), parseInt(field[2]));
    });
    
    $('#divNewGame').click(function (evt) {
        evt.preventDefault();

        var gameType = $(evt.target).closest('span').attr("id");
        
        newGame(gameType);
    });
});
