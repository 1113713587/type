// NOTE: index.php uses main.min.js
document.scale = 1; // 1.5
document.charx = 5; //5
document.chary = 11; //11
document.charsize = 9; //9
document.xchars = 80;
document.ychars = 30;
document.autosize = true;




$(function() {
    "use strict";
    
    
    /*$("#cbCand").button();*/
    $( "#tune" ).hide();
    $( "#preview" ).hide();
    $( "#controls" ).hide();
    $( "#output" ).hide();
    
    $( "#setupsize" ).hide();
    $( "#setupsize" ).dialog( { width:350, modal:true, title:"Grid Size", autoOpen:false } ).dialog( "option", "position", { my: "center", at: "top+25%", of: window } );
    
    $( "#setupcolors" ).hide();
    $( "#setupcolors" ).dialog( { width:350, modal:true, title:"Screen Mode", autoOpen:false } ).dialog( "option", "position", { my: "center", at: "top+25%", of: window } );
    
	
    $( "#setupchars" ).hide();
    $( "#setupchars" ).dialog( { width:350, modal:true, title:"Character Set", autoOpen:false } ).dialog( "option", "position", { my: "center", at: "top+25%", of: window } );
    
	$( "#working" ).hide();
    $( "#working" ).dialog( { width:150, modal:true, title:"Processing", autoOpen:false } ).dialog( "option", "position", { my: "center", at: "top+25%", of: window } );
    
    
	
    //$( "#pdfout" ).hide(); // until ready
    
    $( "#radioset" ).buttonset();
    $( "#themeset" ).buttonset();
    $( "#colorset" ).buttonset();
    $( "#outputtype" ).buttonset();

    $("#bbout").focus(function() {
        var $this = $(this);
        $this.select();

        // Work around Chrome's little problem
        $this.mouseup(function() {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });
    $("#redout").focus(function() {
        var $this = $(this);
        $this.select();

        // Work around Chrome's little problem
        $this.mouseup(function() {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });
    $("#htmlout").focus(function() {
        var $this = $(this);
        $this.select();

        // Work around Chrome's little problem
        $this.mouseup(function() {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });
	$.each($('img'), function() {
			if ( $(this).attr('data-src') && $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) ) {
				var source = $(this).data('src');
				$(this).attr('src', source);
				$(this).removeAttr('data-src');
			}
	})
	$(window).scroll(function() {
		$.each($('img'), function() {
			if ( $(this).attr('data-src') && $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) ) {
				var source = $(this).data('src');
				$(this).attr('src', source);
				$(this).removeAttr('data-src');
			}
		})
	})

    $("#imgur").button().click( function (e){
        e.preventDefault();
        var canvas;
        var img; //$("#iout")[0].src
        canvas = $("#imgout")[0];
        try {
            img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        } catch(e) {
            img = canvas.toDataURL().split(',')[1];
        }
        var title, append, chkd;
        var w = window.open();
        w.document.write('Uploading to imgur.com...');
        title = $("#ititle")[0].value;
        if (title == '') { title = "ASCII art"; }
        chkd = $("#cbCand")[0].checked
        if (chkd) { append = ' - Shared to Gallery'; } else { append = ''; } 
        w.subtitle = title;
        $.ajax({
            url: 'https://api.imgur.com/3/upload.json',
            type: 'POST',
            headers: {
                Authorization: 'Client-ID a5cede9d1a6c1a8'
            },
            data: {
                type: 'base64',
                name: 'asciiart.club.jpg',
                title: title,
                description: ('Made using https://asciiart.club' + append),
                image: img
            },
            dataType: 'json'
        }).success(function(data) {
			var ptyp;
			if (chkd==true) { ptyp='Shared'; } else { ptyp='Private'; }
            var url;
			url = 'https://asciiart.club/view.php?art=' + data.data.id + '&rowid=0&catg=Artwork&titl=' + w.subtitle + '&ptyp=' + ptyp;
            //_gaq.push(['_trackEvent', 'asciizzlorg', 'share', url]);
            ga('send', 'event', 'category', 'share-imgur-' + chkd, url);
            w.location.href = url;
        }).error(function() {
            alert('Could not reach api.imgur.com. Sorry :(');
            w.close();
            ga('send', 'event', 'category', 'share-imgur', 'fail');
            //_gaq.push(['_trackEvent', 'asciizzlorg', 'share', 'fail']);
        });
    }
    );



    
    
    $( "#sizedone" ).button().click( function (e) {
        e.preventDefault();
        document.autosize=false;
        initScene();
        document.scn.initsize(); // does goforsize, then initscene 
        document.scn.updateImage();
        document.scn.rendering=false;
        document.scn.chardatavalid = false;
        $( "#setupsize" ).dialog( "close" );
        generate();
        // grid settings were adjusted. if we have an image, readjust

    });
    $( "#colorsdone" ).button().click( function (e) {
        e.preventDefault();
        if (document.screenmode.name == "c16" ) {
            //$("#slcolor").slider( "disable" ); // need to move the slider..
            //$("#slcolor").val(127);
            //$("#slcolor").slider( "enable" );
            //$("#slcolor").slider("refresh"); // anyone know a way that works?
            
        } else {
            //$("#slcolor").slider( "disable" );
            //$("#slcolor").val(254);
            //$("#slcolor").slider( "enable" );
            //$("#slcolor").slider("refresh");
        }
        //initScene();
        document.scn.initsize(); // does goforsize, then initscene 
        document.scn.updateImage();
        document.scn.rendering=false;
        document.scn.chardatavalid = false;
        $( "#setupcolors" ).dialog( "close" );
        generate();
        // grid settings were adjusted. if we have an image, readjust

    });
    $( "#charsdone" ).button().click( function (e) {
        e.preventDefault();
        // grid settings were adjusted. if we have an image, readjust
        //initScene();
        document.scn.initsize();
        document.scn.rendering=false;
        document.scn.chardatavalid = false;
        document.scn.updateImage();
        $( "#setupchars" ).dialog( "close" );
        generate();

    });
    
    $( "#getfilego" ).button().click( function (e) {
        e.preventDefault();
        var dfile = document.getElementById('getfile').files[0];
        
        if (!dfile.type.match(/image.*/i)) {
            alert("This file is not an image.");
        } else {
            if (document.scn!== undefined) { document.scn.rendering=false;	}
            
            $( "#tune" ).show(); /* no use showing until an image is up */
            $( "#preview" ).show();
            $( "#controls" ).show();
            processImage(dfile);
            
        }

    });
    
    $( "#getfileurlgo" ).button().click( function (e) {
        e.preventDefault();
        var dfile = document.getElementById('getfileurl').value;

            try {
            document.scn.rendering=false;
            $( "#tune" ).show(); /* no use showing until an image is up */
            $( "#preview" ).show();
            $( "#controls" ).show();
            processImageURL(dfile);
            } catch(e) {
                alert("Could not load image.");
                $( "#tune" ).hide();
                $( "#preview" ).hide();
                $( "#controls" ).hide();
            }

    });
    $( "#extended" ).button();
    
    $( "#sizebtn" ).button().click( function( event, ui ) {
        event.preventDefault();
        try { $( "#setupsize").dialog("open"); 
        //document.scn.updateImage();
        } catch(e) { }
    });
    
    $( "#charbtn" ).button().click( function( event, ui ) {
        event.preventDefault();
        try { $( "#setupchars").dialog("open"); 
        } catch(e) { }
    });
    
    $( "#colorbtn" ).button().click( function( event, ui ) {
        event.preventDefault();
        try { $( "#setupcolors").dialog("open"); 
        } catch(e) { }
    });
    
    $( "#regen" ).button().click( function( event, ui ) {
        event.preventDefault();
        try { generate(); //document.scn.updateImage();
        } catch(e) { }
    });
    /*$( "#regen" )[0].onClick = function( event, ui ) {
        event.preventDefault();
        try { generate(); //document.scn.updateImage();
        } catch(e) { }
    };*/
    
    
    $( "#dropzone" ).show();
    
    
    $( "#yoff" ).slider({
        min: 0,
        max: 1000,
        value: 1000,
        step: 1,
        height: "100px",
        orientation: "vertical"
    
    }).slider({
  
    change: function( event, ui ) {
                try { document.scn.updateImage();
                } catch(e) {}
            }
        
    });
    
    
    $( "#slsharp" ).slider({
        min: 55,
        max: 100,
        value: 80,
        step: 1,
        width: "100px",
        orientation: "horizontal"
    
    });
    
    $( "#slcolor" ).slider({
        min: 0,
        max: 255,
        value: 245,
        step: 1,
        width: "100px",
        orientation: "horizontal"
    
    });
    $( "#bwslider" )[0].values = Array(20,235); // match default, updates on slide
    $( "#bwslider" ).slider({
        min: 0,
        max: 255,
        step: 1,
        range: true,
        width: "100px",
        values: [ 20, 235 ],
        slide: function( event, ui ) {
            $('#bwslider')[0].values[0] = ui.values[0];
            $('#bwslider')[0].values[1] = ui.values[1];
        }
        
    });
    
    $('input').addClass("ui-corner-all");
    
    //$("#wd").click(function() {
        // set Custom active
    //});
    
            
    
});
        

function convert(integer) { 
    "use strict";
    var str = Number(Math.round(integer)).toString(16); 
    return str.length == 1 ? "0" + str : str; 
}


function hex(r, g, b) {
    "use strict";
    return "#" + convert(r) + convert(g) + convert(b);
}
        
function openColor(rgb) {
    "use strict";
    return "<span style='color:" + hex(rgb.r,rgb.g,rgb.b) + "'>";
}

function convert1(integer) { 
    "use strict";
    var str = Number(Math.round(integer)).toString(16); 
	str = str.length == 1 ? "0" + str : str;
    return str.substr(0,1); 
}


function hex1(r, g, b) {
    "use strict";
    return "#" + convert1(r) + convert1(g) + convert1(b);
}
        


function openColor1(rgb) {
    "use strict";
    if (document.scn.lowcol) {
		return "<span style='color:" + hex1(rgb.r,rgb.g,rgb.b) + "'>"; // #000
	} else {
		return "<span style='color:" + hex(rgb.r,rgb.g,rgb.b) + "'>"; // #000000
	}
}

function scale(o255,bp,wp) {
    "use strict";
    var c;
    c = (wp-bp)/255.0;
    return bp + (o255 * c);
    
}

function linear(y,iMin,iMax,oMin,oMax) {
    "use strict";
    var c1, c2, x, i;
    c1 = (iMax-iMin);
    c2 = (oMax-oMin);
    x = (y - iMin)/c1;
    i = oMin + (x * c2);
    if (i<oMin) { i=oMin; }
    if (i>oMax) { i=oMax; }
    
    return i;
    
}



function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/ /g, '&nbsp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/&#9632;/g, '<p>')
            ;
} // &#9632; used as placeholder for \n which terminates strings

function htmlUnescape(value){
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&');
}

function comprgb(a,b) {
    var x;
    x=Math.abs(a.r-b.r);
    x+=Math.abs(a.g-b.g);
    x+=Math.abs(a.b-b.b);
    return x/(255*3);
}
function subrgb(a,b) {
    var x;
    x = new clr((a.r-b.r),(a.g-b.g),(a.b-b.b));
    
    return x;
}
function addrgb(a,b) {
    var x;
    x = new clr((a.r+b.r),(a.g+b.g),(a.b+b.b));
    
    return x;
}
function multrgb(a,b) {
    var x;
    x = new clr(((a.r/255)*(b.r/255))*255,((a.g/255)*(b.g/255))*255,((a.b/255)*(b.b/255))*255);
    
    return x;
}

function clr(ir,ig,ib) {
        
    var me,tc,i,ac,minc,mini,ic,cv;
    me = this;
    cv = document.scn.cv;
    this.r = ir;
    this.g = ig;
    this.b = ib;
    mini=0;
    minc=256;
    this.strong = function() {
        var drop;
        
        if (document.screenmode.name == "bonw") {
            
            drop = Math.min(me.r,me.g,me.b);
            drop=drop/2;
            return new clr(me.r-drop, me.g-drop, me.b-drop);
        }else{
            drop = Math.min(255-me.r,255-me.g,255-me.b);
            drop=drop/2;
            return new clr(me.r+drop, me.g+drop, me.b+drop);
        }
    

    };
    this.strong16 = function() {
        var drop;
        //if (document.screenmode.name == "c16") {
            drop = Math.min(255-me.r,255-me.g,255-me.b);
            drop=drop/2;
            tc = new clr(me.r+drop, me.g+drop, me.b+drop);
            for (i=1;i<16;i++) {
                ac = document.screenmode.gamut[i];
                ic = comprgb(ac,tc)*Math.pow(cv*2,0.5)*2;
                ic2 = comprgb(ac,me);
                if (( true )&&((i==7)||(i==8)||(i==15))) { ic*=(cv*3); ic2*=2;  }
                if (ic<minc) { minc=ic; mini=i; }
                if (ic2<minc) { minc=ic2; mini=i; }
                
            }
            return document.screenmode.gamut[mini];

    };
    this.rgbhex = function() {
        return hex(this.r,this.g,this.b);
    }
    
}


function linearrgb(p,a,b) {
    "use strict";
    var o, cr, cg, cb, x;
    // a and b are clr objects
    // p is 0-1 proportion of a to b
    if (b==null) { return a; }
    
    o = new clr(0,0,0);
    cr = (a.r-b.r);
    cg = (a.g-b.g);
    cb = (a.b-b.b);
    o.r = a.r - (cr * p); // transform towards b according to prop factor
    o.g = a.g - (cg * p);
    o.b = a.b - (cb * p);
    
    return o;
    
}

        
        





function avg(list) {
    "use strict";
    var n,
    t,
    i;
    n = list.length;
    t = 0;
    for (i = 0; i < n; i++) {
        t += list[i] / n;
    }
    return t;
}
function createArray(length) {
    
    
    var arr, args, i;
    arr = new Array(length || 0); i = length;

    if (arguments.length > 1) {
        args = Array.prototype.slice.call(arguments, 1);
        while(i--) { arr[length-1 - i] = createArray.apply(this, args); }
    }

    return arr;
}





function Cell(x, y, p) {
    "use strict";
    this.parent = p;
    this.xpos = x;
    this.ypos = y;
    this.schar = "";
    this.ochar = "";
    this.blackest = 10000;
    this.whitest = 0;
    this.avgcolor = null;
    this.gamutcolor = null;
    this.rgb = new clr(0,0,0);
    this.avg = 127;
    this.px = Math.round(x * p.cellw);
    this.py = Math.round(y * p.cellh);
    this.pw = Math.round(((x + 1) * p.cellw) - 1) - this.px;
    this.ph = Math.round(((y + 1) * p.cellh) - 1) - this.py;
    this.re = 0;
    this.ccell = null;
    this.cdri=0;
    // temp hardcode for 3X4 'segments' per char
    /*
    0  1  2
    3  4  5
    6  7  8
    9 10 11
     */

    this.segcount = 0;
    this.segr = 0;
    this.segg = 0;
    this.segb = 0;
    this.segn = 0;
    this.sega = 0;

    this.segrgb = 0;
    this.segrgb = {};

    this.segr = [];
    this.segg = [];
    this.segb = [];
    this.sega = [];
    this.segn = [];

    this.loadsegment = function (c) {
        var imageData,
        data,
        buffer,
        dared,
        dagreen,
        dablue,
        segnum,
        lsegnum,
        segrow,
        segcol,
        i,
        n,
        segcols,
        segrows,
        numrows,
        rowlength,
        pixcol, pixrow, cct, ccb, cc, yp, xp, pc, pr;

        imageData = c.parent.context.getImageData(c.px, c.py, c.pw+1, c.ph+1);
        data = imageData.data;

        var i, bchaos, lchaos;		
        var scaling;
        
        
        //scaling = true;
        //segcols = 3; // low
        //segrows = 5;
        
        //scaling = true;
        //segcols = 4; // 5 med
        //segrows = 6;  // we need to average otherwise ▌ = ▒
        
        scaling = false;
        segcols = c.pw; // high
        segrows = c.ph;
        
        
        buffer = createArray(c.ph+3, c.pw+3);
        
        y=0;x=0;
        for (i = 0, n = data.length; i < n; i += 4) {
        
            dared = Number(data[i]);
            dagreen = Number(data[i + 1]);
            dablue = Number(data[i + 2]);
            buffer[y][x] = new clr(dared,dagreen,dablue);
            x++;
            if (x > c.pw) { x=0; y++; }
        }

        segnum = -1;
        lsegnum = -1;
        
        c.segcount = segcols*segrows;
        
        for (i = 0; i < c.segcount; i += 1) {
            c.segrgb[i] = new clr(0,0,0);
            c.sega[i]=0;
        }
        
        
        
        //for (i = 0, n = data.length; i < n; i += 4) {
        
        for (segrow = 0; segrow < segrows; segrow++) {
            for (segcol = 0; segcol < segcols; segcol++) {
                
                if (scaling) {
                // provide subpixel coords for buffer
                pixrow = linear(segrow, 0, segrows-1, 0, c.ph-1);
                
                pixcol = linear(segcol, 0, segcols-1, 0, c.pw-1);
                } else {
                    pixrow = segrow;
                    pixcol = segcol;
                }
                
                segnum = (segrow * segcols) + segcol;
                
                pc = Math.floor(pixcol);
                pr = Math.floor(pixrow);
                
                if (scaling) {
                
                    yp = pixrow % 1;
                    xp = pixcol % 1;
                    
                    cct = linearrgb(xp, buffer[pr][pc], buffer[pr][pc+1]);
                    ccb = linearrgb(xp, buffer[pr+1][pc], buffer[pr+1][pc+1]);
                    cc = linearrgb(yp, cct, ccb);
                
                } else {
                
                    cc = new clr( buffer[pr][pc].r, buffer[pr][pc].g, buffer[pr][pc].b );
                }
                
                c.segrgb[segnum] = cc;
                c.sega[segnum] = (cc.r + cc.g + cc.b + Math.max(cc.r, cc.g, cc.b)) / 4.0;
                
            }
            
        }
        c.avg = 0;
        c.rgb = new clr(0,0,0);
        for (i = 0; i < c.segcount; i += 1) {
        
        
            c.avg += c.sega[i] / c.segcount;
            
            c.rgb.r += c.segrgb[i].r;
            c.rgb.g += c.segrgb[i].g;
            c.rgb.b += c.segrgb[i].b;
            
            if (c.sega[i] < c.blackest) { c.blackest = c.sega[i]; }
            if (c.sega[i] > c.whitest) { c.whitest = c.sega[i]; }
            
            
        }
        
        c.rgb.r = c.rgb.r / c.segcount;
        c.rgb.g = c.rgb.g / c.segcount;
        c.rgb.b = c.rgb.b / c.segcount;

        
        lchaos = c.sega[0];
        bchaos = 0;
        for (i = 0; i < c.segcount; i++) {
            
                
                if (!isNaN(c.sega[i])) {
                    
                    
                    //bchaos += Math.abs((c.sega[i]+lchaos) - (c.avg*2))/2; // consecutive segments of high diff count double
                    bchaos += Math.abs(c.sega[i] - c.avg);
                    //lchaos = c.sega[i];
                }
        }
        
        c.chaos = (bchaos/(c.segcount*255));
        
    };

    
    
    
    this.loadsegment(this);

}



function gssegcomplin(a,b, bps, wps, shp) {
    // compare two cells in greyscale
    // where b is charData
    // bps = blackpoint of text
    // mult = scale image data to fit
    // curve is f(x) = bps + (x*mult)

    var ent, i, imgval, charval;


    ent=0;
    for (i = 0; i < a.segcount; i++) {
        
            imgval = linear(a.sega[i], (a.blackest+bps)/2, (a.whitest+wps)/2, 0, 255); // scale
            charval = linear(b.sega[i],document.scn.blackpoint, 255, 0, 255);

            if ((!isNaN(imgval))&&(!isNaN(charval))) {
                ent += Math.sqrt(Math.abs(Math.pow(imgval,2) - Math.pow(charval,2)));
            }
    }
    
    b.ent = (ent/(a.segcount*255)); // factored per-pix diff match score attached, 0-1 output, 0 = perfect match
    
    return b.ent;

}

function gssegcompmax(a,b, bps, wps, shp) {
        var ent, i, imgval, charval;


    ent=0;
    for (i = 0; i < a.segcount; i++) {
        
            imgval = linear(a.sega[i], (a.blackest+bps)/2, (a.whitest+wps)/2, 0, 255); // scale
            charval = linear(b.sega[i], b.blackest, b.whitest, 0, 255);

            if ((!isNaN(imgval))&&(!isNaN(charval))) {
                ent += Math.sqrt(Math.abs(Math.pow(imgval,2) - Math.pow(charval,2))); //Math.abs(imgval - charval);
            }
    }
    
    b.ent = (ent/(a.segcount*255)); // factored per-pix diff match score attached, 0-1 output, 0 = perfect match
    
    return b.ent;

}

function require(script) {
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- This is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}

if (typeof JSON.decycle !== 'function') {
    JSON.decycle = function decycle(object) {
        'use strict';
        var objects = [], // Keep a reference to each unique object or array
        paths = []; // Keep the path to each unique object or array
        return (function derez(value, path) {
            var i, // The loop counter
            name, // Property name
            nu; // The new object or array
            // typeof null === 'object', so go on if this value is really an object but not
            // one of the weird builtin objects.
            if (typeof value === 'object' && value !== null &&
            !(value instanceof Boolean) &&
            !(value instanceof Date) &&
            !(value instanceof Number) &&
            !(value instanceof RegExp) &&
            !(value instanceof String)) {
                for (i = 0; i < objects.length; i += 1) {
                    if (objects[i] === value) {
                        return {$ref: paths[i]};
                    }
                }
                // Otherwise, accumulate the unique value and its path.
                objects.push(value);
                paths.push(path);
                // If it is an array, replicate the array.
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    nu = [];
                    for (i = 0; i < value.length; i += 1) {
                        nu[i] = derez(value[i], path + '[' + i + ']');
                    }
                } else {
                // If it is an object, replicate the object.
                    nu = {};
                    for (name in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name)) {
                            nu[name] = derez(value[name],
                            path + '[' + JSON.stringify(name) + ']');
                        }
                    }
                }
            return nu;
        }
        return value;
        }(object, '$'));
    };
}
if (typeof JSON.retrocycle !== 'function') {
    JSON.retrocycle = function retrocycle($) {
        'use strict';
        var px = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;
        (function rez(value) {
            var i, item, name, path;
            if (value && typeof value === 'object') {
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    for (i = 0; i < value.length; i += 1) {
                        item = value[i];
                        if (item && typeof item === 'object') {
                            path = item.$ref;
                            if (typeof path === 'string' && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    }
                } else {
                    for (name in value) {
                        if (typeof value[name] === 'object') {
                            item = value[name];
                            if (item) {
                                path = item.$ref;
                                if (typeof path === 'string' && px.test(path)) {
                                    value[name] = eval(path);
                                } else {
                                    rez(item);
                                }
                            }
                        }
                    }
                }
            }
        }($));
        return $;
    };
}


function Scene(initimg) {
    var cy,
    cx,
    row,
    scanvas,
    c, x,y,w,h,
    style, cont, otxt, stxt, cc,
    ocs, me,
    sstxt, ocss,
    i,smax,
    sch,
	lowcol, cv,
    filledheight,filledrows;
    
    
    me = this;
    
    if (initimg !== undefined) {
        this.img = initimg;
    }
    if (this.img === undefined) {
        this.img = null;
    }
    if (!(document.scn===undefined)) {
        if (!(document.scn.img===undefined)) {
            this.img = document.scn.img;
        }
    }
    document.colorset = { "bonw":{},"wonb":{},"c16":{} };
    document.colorset.bonw.fg = "black";
    document.colorset.bonw.bg = "white";
    document.colorset.bonw.name = "bonw";
    document.colorset.bonw.gamut= "full";
    document.colorset.wonb.fg = "white";
    document.colorset.wonb.bg = "black";
    document.colorset.wonb.name = "wonb";
    document.colorset.wonb.gamut= "full";
    document.colorset.c16.fg = "white";
    document.colorset.c16.bg = "black";
    document.colorset.c16.name = "c16";
    document.colorset.c16.gamut= new Array(
        new clr(  0,  0,  0),
        new clr(170,  0,  0),
        new clr(  0,170,  0),
        new clr(170, 85,  0),
        new clr(  0,  0,170),
        new clr(170,  0,170),
        new clr(  0,170, 85),
        new clr(170,170,170),
        new clr( 85, 85, 85),
        new clr(255, 85, 85),
        new clr( 85,255, 85),
        new clr(255,255, 85),
        new clr( 85, 85,255),
        new clr(255, 85,255),
        new clr( 85,255,255),
        new clr(255,255,255)
        ); //"std vga";

    
    this.sizechanged = function() {
        if (document.autosize) {
        
            if (this.img !== null) {
                document.xchars = 80;
                filledrows = ((this.img.height/11) / (this.img.width/5)) * document.xchars;
            
                
                document.ychars = Math.round(filledrows);
                $("#ht")[0].value = document.ychars;
            }
        }
        x = document.xchars;
        this.xchars = x;
        
        y = document.ychars;
        this.ychars = y;
        
        w = x*document.charx; h = y*document.chary;
        this.pixwidth = w;
        this.pixheight = h;
        
        this.yoff = 1.0-(Number($("#yoff").slider("value"))/1000.0); //height offset
        
        this.text = "";
        this.maxchaos = 0;
        
        this.rendering=false;
        
        
        
        this.nextscanrow = 0;
        
        
        // size changed
        
        
        scanvas = document.getElementById('splash-container');
        
        scanvas.width = w;
        scanvas.height = h;
        $('#splash-container').width(w);
        $('#splash-container').height(h);

        $('#procimg').width(this.pixwidth);
        $('#procimg').height(this.pixheight);
        
        $('#textout').width(w+50);
        $('#textout').height(h);
        
        
        
        
        this.context = scanvas.getContext('2d');
        
        this.cellw = document.charx; //scanvas.width / x; // 5
        this.cellh = document.chary; //scanvas.height / y; // 11
        this.rows = [];

        
        
        $('#textout').width(w+80);
        $('#textout').height(h+4);
        
        $('#yoff').height(h);
        $('#yoff').css("margin-left",(w+10)+"px");
    
    }
    
    this.sizechanged();

    this.chardatavalid=false;
    
    this.initChars =  function() {
    // load chardata
        
        colors = $( "#colorset :radio:checked" ).attr('value');
        
        document.screenmode = document.colorset[colors]; // .fg, .bg, gamut="full", gamut[0-15] = { clr(0),... }
        document.screenmode.name = colors;
        style = "\n<style>\n.xbbcode-b {\nfont-weight:bold;\n}\n.xbbcode-i {\nfont-style: italic;\n}\n.xbbcode-size-4 {font-size:4px;}\n.xbbcode-size-5 {font-size:5px;}\n.xbbcode-size-6 {font-size:6px;}\n.xbbcode-size-7 {font-size:7px;}\n.xbbcode-size-8 {font-size:8px;}\n.xbbcode-size-9 {font-size:9px;}\n.xbbcode-size-10 {font-size:10px;}\n</style>\n";
        
        this.blackpoint = 10000;
        

        this.context.fillStyle = document.screenmode.bg;
        this.context.fillRect(0,0,scanvas.width,scanvas.height); // otherwise 0,0,0 at 0% alpha
        
        this.context.fillStyle = document.screenmode.fg;
        this.context.font = document.charsize+"px monospace"; // d 100
        

        this.charDataRow = [];
        
        
        
        stxt = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
        //ocs = '&nbsp; ! " # $ % & &#x0027; ( ) * + , - . &#x002F; 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ &#x005C; ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~';
        
        // if extended...
        
        
        value = $( "#themeset :radio:checked" ).attr('value');
        document.theme = value;
        
        if (value == "extended" ) {
            stxt+= '⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡≥≤⌠⌡÷≈√ⁿ²';
        //	ocs += ' &#x2302; &Ccedil; &uuml; &eacute; &acirc; &auml; &agrave; &aring; &ccedil; &ecirc; &euml; &egrave; &iuml; &icirc; &igrave; &Auml; &Aring; &Eacute; &aelig; &AElig; &ocirc; &ouml; &ograve; &ucirc; &ugrave; &yuml; &Ouml; &Uuml; &cent; &#x00a3; &#x00a5; &#x20a7; &#x0192; &aacute; &iacute; &oacute; &uacute; &ntilde; &Ntilde; &#x00aa; &#x00ba; &#x00bf; &#x2310; &#x00ac; &#x00bd; &#x00bc; &#x00a1; &#x00ab; &#x00bb; &#x2591; &#x2592; &#x2593; &#x2502; &#x2524; &#x2561; &#x2562; &#x2556; &#x2555; &#x2563; &#x2551; &#x2557; &#x255d; &#x255c; &#x255b; &#x2510; &#x2514; &#x2534; &#x252c; &#x251c; &#x2500; &#x253c; &#x255e; &#x255f; &#x255a; &#x2554; &#x2569; &#x2566; &#x2560; &#x2550; &#x256c; &#x2567; &#x2568; &#x2564; &#x2565; &#x2559; &#x2558; &#x2552; &#x2553; &#x256b; &#x256a; &#x2518; &#x250c; &#x2588; &#x2584; &#x258c; &#x2590; &#x2580; &#x03b1; &szlig; &#x0393; &#x03c0; &#x03a3; &#x03c3; &#x00b5; &#x03c4; &#x03a6; &#x0398; &#x03a9; &#x03b4; &#x221e; &#x03c6; &#x03b5; &#x2229; &#x2261; &#x2265; &#x2264; &#x2320; &#x2321; &#x00f7; &#x2248; &#x221a; &#x207f; &#x00b2;';
            
        }
        if (value == "boxonly" ) {
            stxt = ' ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀';
        }
        if (value == "block" ) {
            stxt = ' ░▒▓█▄▌▐▀';
        }
        if (value == "unbreakable" ) {
            stxt = '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀';
        }

        if (value == "outline" ) {
            stxt = ' │┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌';
        }
        if (value == "slash" ) {
            stxt = ' \\/-_|';
        }
        if (value == "oldskool" ) {
            stxt = ' _/\\-+=.()<>';
        }
        if (value == "hebrew" ) {
            //stxt = '~{|}`‾^[]zxnsbdouıbpq@¿>=<:0689/˙-\'+*(),\\%$#"';
            stxt = 'אבגדהוזחטיךכלםמןנסעףפץצקרשתװױײ׳״ﬠשׁשׂשּׁשּׂאַאָאּבּגּדּהּוּזּטּיּךּכּלּמּנּסּףּפּצּקּרּשּתּוֹבֿכֿפֿﭏ';
        }
        if (value == "greek" ) {
            //stxt = '~{|}`‾^[]zxnsbdouıbpq@¿>=<:0689/˙-\'+*(),\\%$#"';
            stxt = ';΄΅Ά·ΈΉΊΌΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ';
        }
        if (value == "hangul" ) {
            //stxt = '~{|}`‾^[]zxnsbdouıbpq@¿>=<:0689/˙-\'+*(),\\%$#"';
            stxt = 'ﾡﾢﾣﾤﾥﾦﾧﾨﾩﾪﾫﾬﾭﾮﾯﾰﾱﾲﾳﾴﾵﾶﾷﾸﾹﾺﾻﾼﾽﾾￂￃￄￅￆￇￊￋￌￍￎￏￒￓￔￕￖￗￚￛￜ';
        }
        if (value == "braille" ) {
                stxt = '⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿';
        }
		if (value == "sjis" ) {
                stxt = ' ｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ';
        }

        if (value == "custom" ) {
                stxt = $("#customtext")[0].value;
        }


        //var ocs = 
        stxt.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
       return '&#'+i.charCodeAt(0)+';';
        });
        
        for (cx = 0; cx < stxt.length; cx++) {
            sch = stxt.substr(cx,1);
            this.context.fillStyle = document.screenmode.fg;
            otxt = this.context.fillText(sch, 0, document.charsize);
            //otxt = this.context.fillText(sch, 0, 8);
            
        
            cc = new Cell(0, 0, this);
            cc.schar = sch;
            
            //cc.ochar = ocss[cx];
            cc.ochar = sch.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
                return '&#'+i.charCodeAt(0)+';';
            }).replace(/ /g, '&nbsp;');
            this.charDataRow.push(cc);
            if (cc.avg < this.blackpoint) { this.blackpoint = cc.avg; }

            this.context.fillStyle = document.screenmode.bg;
            this.context.fillRect(0,0,5,11); // otherwise 0,0,0 at 0% alpha
            
        }
        
        //console.log("data." + document.theme + "." + document.screenmode.name + " = ");
        //console.log(JSON.stringify(JSON.decycle(this.charDataRow)));

        this.context.fillRect(0,0,scanvas.width,scanvas.height); // otherwise 0,0,0 at 0% alpha
        this.chardatavalid = true;
    }
    this.initChars();
    
    

    //generate();  // scan, colorize, translate
    
    
    // functions
    
    this.updateImage = function() {
        var i, a, filledrows;
        this.yoff = 1.0-(Number($("#yoff").slider("value"))/1000.0);
            
        
        if (document.scn.img !== null) {
        
            this.img=document.scn.img;
                
            if (document.autosize) {
                    
                document.xchars = 80;
                filledrows = ((this.img.height/11) / (this.img.width/5)) * document.xchars;
                
                document.ychars = Math.round(filledrows);
                $("#ht")[0].value = document.ychars;
            }
            
            
            scanvas = document.getElementById('splash-container');

            scanvas.width = w;
            scanvas.height = h;
            $('#splash-container').width(w);
            $('#splash-container').height(h);

            $('#textout').width(w+50);
            $('#textout').height(h);

            //this.cellw = scanvas.width / x; // 5
            //this.cellh = scanvas.height / y; // 11
            //this.rows = [];

            $('#textout').width(w+80);
            $('#textout').height(h+4);

            $('#yoff').height(h);
            $('#yoff').css("margin-left",(w+10)+"px");

                
        }
            
        
        if (this.img !== null) {
            filledheight = this.img.height * (scanvas.width / this.img.width);
        
        } else { filledheight = scanvas.height; }
        
         // wipe out background
        this.context.fillStyle = document.screenmode.bg;
        this.context.fillRect(0,0,scanvas.width,scanvas.height); // otherwise 0,0,0 at 0% alpha
        document.wait=false;

        
		var piccan, pictx, picsrc, picimg, elem;
        if (this.img !== null) {
            this.context.drawImage(this.img, 0, -this.yoff*(filledheight-scanvas.height), scanvas.width, filledheight); //img.width * 0.3, img.height * 0.3);
			
			piccan = document.getElementById('procimg');
			picsrc = piccan.toDataURL('image/png');
			
			pictx = piccan.getContext("2d");			 //.width(this.pixwidth);
			
			picimg = document.createElement("img");
			document.getElementById("process").appendChild(picimg);
			picimg.src = picsrc;  //setAttribute("src", picsrc);

			
			pictx.drawImage(picimg, 0, 0, document.scn.pixwidth, document.scn.pixheight);
			
        }
    }
    this.prescan = function() {
        c = document.scn;
        c.rendering=false;
		c.cv = Number($("#slcolor").slider("value"))/255;
		
		c.lowcol = ((cv*255) <= 240); // above this threshold, six digit colors are used
        
		c.updateImage();
        var c, acell, tcell, diff, bdiff,bdnum,i,cc,sbp,swp,shp, cccell,row,cx,cy;
        //initScene(); called in quickscan
        
        //filledheight = img.height * (scanvas.width / img.width);
        //c.context.drawImage(img, 0, -c.yoff*(filledheight-scanvas.height), scanvas.width, filledheight); //img.width * 0.3, img.height * 0.3);
        // now uses canvas as-is
        // call updateImage prior
        
        //c.maxchaos=0;
        /*for (cy = 0; cy < y; cy++) {
            row = [];
            for (cx = 0; cx < x; cx++) {
                row.push(new Cell(cx, cy, c));
                if (row[cx].chaos>c.maxchaos) { c.maxchaos = row[cx].chaos; }
            }
            c.rows[cy] = row;
        }*/
        text = "";
        sbp = Number($("#bwslider")[0].values[0]); // Number($("#black")[0].value);
        swp = Number($("#bwslider")[0].values[1]); //Number($("#white")[0].value);
        //shp = Number($("#slsharp").slider("value")); //Number($("#sharp")[0].value);
        shp = (Number($("#slsharp").slider("value")) / 100.0); // 0-1 -> 1-2
        
        $('#textout').css(  "font", document.charsize+"px monospace" );
        $('#textout').css(  "line-height", document.chary+"px" );
        $('#textout').css(  "color", document.screenmode.fg );
        $('#textout').css(  "background", document.screenmode.bg );
        
        var maybe, diff2, bdiff2, tuning, charcount;
        
        $('#textout')[0].innerHTML = "";
        this.nextscanrow = 0;
        this.rendering=true;
        setTimeout("document.scn.scanrow("+sbp+","+swp+","+shp+");",80); // leave time for async kill switch to register
        //cy < y; cy++
        c.text="";
        
    }
    
    this.scanrow = function(sbp,swp,shp) {
        var c, acell, tcell, diff, bdiff,bdnum,i,cc, cccell;
        c = document.scn; //this;
        
        //filledheight = img.height * (scanvas.width / img.width);
        //c.context.drawImage(img, 0, -c.yoff*(filledheight-scanvas.height), scanvas.width, filledheight); //img.width * 0.3, img.height * 0.3);
        // now uses canvas as-is
        // call updateImage prior
        
        
        //sbp = Number($("#bwslider")[0].values[0]); // Number($("#black")[0].value);
        //swp = Number($("#bwslider")[0].values[1]); //Number($("#white")[0].value);
        //shp = Number($("#slsharp").slider("value")); //Number($("#sharp")[0].value);
        //shp = (Number($("#slsharp").slider("value")) / 100.0); // 0-1 -> 1-2
        var maybe, diff2, bdiff2, tuning, charcount,rowtext,perfcell,v;
        
        
        //for (cy = 0; cy < y; cy++) {
        cy = this.nextscanrow;
        
        try {
            rowtext = "";
            //text+='<<p>>';
            row = c.rows[cy];
            for (cx = 0; cx < this.xchars; cx++) {
                maybe = Array();
                acell = row[cx];
                if (acell==undefined) {acell = new Cell(cx, cy, c); }
                bdiff=2.0;
                bdiff2=10000000;
                
                cccell = c.charDataRow[0]; cccell.ent=2.0; // beats crashing, returns blank char tho
                charcount=0;
                tuning=10;
                perfcell=null;
                while ((charcount < (c.charDataRow.length*0.2)+5)&&(perfcell==null)) {
                    charcount=0;
                    for (i = 0; ((i < c.charDataRow.length)&&(perfcell==null)); i++) {
                        v = Math.abs(c.charDataRow[i].avg - acell.avg);
                        if (v < tuning) { charcount++; }
                        if ((v == 0)&& ((acell.avg==0) || (acell.avg == 255))) { bdnum=i; charcount=1; perfcell=c.charDataRow[i]; }
                        
                    }						
                    tuning+=20;
                    
                }
                
                if (perfcell==null) {
                    
                    // shade scan
                    var avdiff,avent, entcalc, aavg;
                    aavg = linear(acell.avg, sbp, swp, 0, 255); // apply brightness scale
                    /*

                        |                  .~'`
                        |              ,O`
                        |         ,~'`  |
                        |     ,O`       |
                        | .~'` |        |
                        |      bp       wp
                        |	   |--ramp--| maps to 0-255				
                    */
                    
                    for (i = 0; i < c.charDataRow.length; i++) {
                        cc = c.charDataRow[i]; // .char = literal
                        avdiff = Math.abs(cc.avg - aavg);
                        avent=avdiff/256;
                        if (avdiff < tuning) {
                            cc.ent=gssegcomplin(acell, cc, sbp, swp, shp+1);
                        
                            entcalc = (((shp)*cc.ent)+((1-shp)*avent));// *((4+Math.abs(cc.chaos - acell.chaos))/5)
                            if ( entcalc < bdiff) { bdiff = entcalc; bdnum = i; cccell = cc; }
                        } else {
                            cc.ent = 2.0; // marks as out of bounds
                        }
                    }
                    
                    
                    //sharp scan
                    if (!(acell.chaos < (shp*c.maxchaos))) { // unless selected cell matches to 0 - 5%
                        
                        for (i = 0; i < c.charDataRow.length; i++) {
                            if (
                                ( Math.abs(cc.chaos - acell.chaos) < ((shp*.5)+.25) )
                                &&
                                ( Math.abs(cc.avg - acell.avg) < ((shp*.5)+.25) )
                                ) { // gather some variety depending on sharpness, check up to 100% mis-matches
                                if (cc.ent < 2) {
                                    diff2 = gssegcompmax(acell, cc, sbp, swp, shp+1);
                                    //cc.ent=gssegcomplin(acell, cc, sbp, swp, shp+1);
                                    
                                    if (cc.ent < bdiff2) { bdiff2 = cc.ent; bdnum = i; cccell = cc; }
                                }
                            }
                        }
                        //console.log(acell.xpos + "," + acell.ypos + ":" + cccell.schar + ":e/15=" + acell.re);
                    
                    }
                
                } else {
                    cccell = perfcell;
                }
                
                
                //acell.schar = String.fromCharCode(bdnum+32)
                acell.schar = cccell.schar;
                acell.ochar = cccell.ochar;
                acell.cdri = bdnum;
                acell.ccell = cccell;
                if (acell.ochar) {				
                    rowtext += ((acell.ochar.length>2) ? acell.ochar : htmlEscape(acell.ochar));
                    
                }
            }
        
        c.text+=rowtext;
        
        row.rowtext=rowtext;
        
        
            
        $('#textout')[0].innerHTML += '<p>' + rowtext + '</p>';
        
        
        //c.text+='</p>';
        //$('#textout')[0].innerHTML = "<p>" + c.text;
        //c.text+='<p>';
        
        //}
        //$('#textout')[0].innerHTML = "<p>" + text;
        cy += 1;
        this.nextscanrow = cy;
        if (cy<this.ychars) {
            if ((this.rendering==true)||(cy<3)) {
                this.rendering=true; // auto-enables
                setTimeout("document.scn.scanrow("+sbp+","+swp+","+shp+");",50);
            } // global boolean dead-man-switch for render chain
        } else {
            this.postscan();
            // postscan ?
        }
        
        } catch (e) { alert(e); /* invalidated Scene will cause error */ };
        
    };
    
    this.postscan = function() {
        var clrng;
        //clrng = Number($("#color")[0].value);
        clrng = Number($("#slcolor").slider("value"));

        if (clrng>0) {
            document.scn.colorize(255-clrng); // set color diff threshold
        }

        translate();
        ga('send', 'event', 'category', 'generate', 'generate');
    }
    
    
    this.quickscan = function() {
        var c, acell, tcell, diff, bdiff,bdnum,i,text,cc,sbp,swp,shp, cccell, rowtext;
        var maxchaos;
        c = document.scn;
        
        //this.updateImage(); called in generate
        //initScene();
        
        //filledheight = img.height * (scanvas.width / img.width);
        //c.context.drawImage(img, 0, -c.yoff*(filledheight-scanvas.height), scanvas.width, filledheight); //img.width * 0.3, img.height * 0.3);
        // now uses canvas as-is
        // call updateImage prior
        
        maxchaos=0;
        for (cy = 0; cy < c.ychars; cy++) {
            row = [];
            for (cx = 0; cx < c.xchars; cx++) {
                row.push(new Cell(cx, cy, c));
                
                    // below not needed for quickscan, but we'll keep it for progressive passes
                if (row[cx].chaos>maxchaos) { maxchaos = row[cx].chaos; }
            }
            c.rows[cy] = row;
        }
        c.maxchaos = maxchaos; /*
        c.text = "";
        rowtext="";
        
        sbp = Number($("#bwslider")[0].values[0]); // Number($("#black")[0].value);
        swp = Number($("#bwslider")[0].values[1]); //Number($("#white")[0].value);
        //shp = Number($("#slsharp").slider("value")); //Number($("#sharp")[0].value);
        shp = (Number($("#slsharp").slider("value")) / 100.0); // 0-1 -> 1-2
        var maybe, diff2, bdiff2, tuning, charcount;
        
        $('#textout').css(  "font", document.charsize+"px monospace" );
        $('#textout').css(  "line-height", document.chary+"px" );
        $('#textout').css(  "color", document.screenmode.fg );
        $('#textout').css(  "background", document.screenmode.bg );
        
        
        for (cy = 0; cy < y; cy++) {

            //text+='<<p>>';
            row = c.rows[cy];
            for (cx = 0; cx < x; cx++) {
                maybe = Array();
                acell = row[cx];
                bdiff=300.0;
                bdiff2=10000000;
                
                cccell = c.charDataRow[0]; cccell.ent=300.0;// beats crashing, returns blank char tho
                
                // shade scan
                var avdiff,avent, entcalc, aavg;
                aavg = linear(acell.avg, sbp, swp, 0, 255); // apply brightness scale

                
                for (i = 0; i < c.charDataRow.length; i++) {
                    cc = c.charDataRow[i]; // .char = literal
                    avdiff = Math.abs(cc.avg - aavg);
                    
                    if ( avdiff < bdiff) { bdiff = avdiff; bdnum = i; cccell = cc; }
                    // as simple as it gets for crude shading pass
                }
                
                //acell.schar = String.fromCharCode(bdnum+32)
                acell.schar = cccell.schar;
                acell.ochar = cccell.ochar;
                acell.cdri = bdnum;
                acell.ccell = cccell;
                if (acell.ochar) {				
                    rowtext += ((acell.ochar.length>2) ? acell.ochar : htmlEscape(acell.ochar));
                }
            }
            
            //c.text+=rowtext;
            row.rowtext=rowtext;
            
            //c.text+='</p>';
            //$('#textout')[0].innerHTML = "<p>" + text;
            //c.text+='<p>';
            
        }
        //$('#textout')[0].innerHTML = "<p>" + c.text;
        */
    };
    
    /*this.oldscan = function() {
        this.quickscan = function() {
        var c, acell, tcell, diff, bdiff,bdnum,i,text,cc,sbp,swp,shp, cccell;
        var maxchaos;
        c = this;
        
        //filledheight = img.height * (scanvas.width / img.width);
        //c.context.drawImage(img, 0, -c.yoff*(filledheight-scanvas.height), scanvas.width, filledheight); //img.width * 0.3, img.height * 0.3);
        // now uses canvas as-is
        // call updateImage prior
        
        maxchaos=0;
        for (cy = 0; cy < y; cy++) {
            row = [];
            for (cx = 0; cx < x; cx++) {
                row.push(new Cell(cx, cy, c));
                if (row[cx].chaos>maxchaos) { maxchaos = row[cx].chaos; }
            }
            c.rows[cy] = row;
        }
        text = "";
        
        sbp = Number($("#bwslider")[0].values[0]); // Number($("#black")[0].value);
        swp = Number($("#bwslider")[0].values[1]); //Number($("#white")[0].value);
        //shp = Number($("#slsharp").slider("value")); //Number($("#sharp")[0].value);
        shp = (Number($("#slsharp").slider("value")) / 100.0); // 0-1 -> 1-2
        var maybe, diff2, bdiff2, tuning, charcount;
        
        $('#textout').css(  "font", document.charsize+"px monospace" );
        $('#textout').css(  "line-height", document.chary+"px" );
        $('#textout').css(  "color", document.screenmode.fg );
        $('#textout').css(  "background", document.screenmode.bg );
        
        
        for (cy = 0; cy < y; cy++) {

            //text+='<<p>>';
            row = c.rows[cy];
            for (cx = 0; cx < x; cx++) {
                maybe = Array();
                acell = row[cx];
                bdiff=2.0;
                bdiff2=10000000;
                
                cccell = c.charDataRow[0]; cccell.ent=2.0;// beats crashing, returns blank char tho
                charcount=0;
                tuning=10;
                while (charcount < (c.charDataRow.length*0.4)) {
                    charcount=0;
                    for (i = 0; i < c.charDataRow.length; i++) {
                        if (Math.abs(c.charDataRow[i].avg - acell.avg) < tuning) { charcount++; }
                    }						
                    tuning+=20;
                    
                }
                
                // shade scan
                var avdiff,avent, entcalc, aavg;
                aavg = linear(acell.avg, sbp, swp, 0, 255); // apply brightness scale

                for (i = 0; i < c.charDataRow.length; i++) {
                    cc = c.charDataRow[i]; // .char = literal
                    avdiff = Math.abs(cc.avg - aavg);
                    avent=avdiff/256;
                    if (avdiff < tuning) {
                        cc.ent=gssegcomplin(acell, cc, sbp, swp, shp+1);
                    
                        entcalc = (((shp)*cc.ent)+((1-shp)*avent));// *((4+Math.abs(cc.chaos - acell.chaos))/5)
                        if ( entcalc < bdiff) { bdiff = entcalc; bdnum = i; cccell = cc; }
                    } else {
                        cc.ent = 2.0; // marks as out of bounds
                    }
                }
                
                
                //sharp scan
                if (!(acell.chaos < (shp*maxchaos))) { // unless selected cell matches to 0 - 5%
                    
                    for (i = 0; i < c.charDataRow.length; i++) {
                        if (
                            ( Math.abs(cc.chaos - acell.chaos) < ((shp*.5)+.25) )
                            &&
                            ( Math.abs(cc.avg - acell.avg) < ((shp*.5)+.25) )
                            ) { // gather some variety depending on sharpness, check up to 100% mis-matches
                                
                            diff2 = gssegcompmax(acell, cc, sbp, swp, shp+1);
                            //cc.ent=gssegcomplin(acell, cc, sbp, swp, shp+1);
                            
                            if (cc.ent < bdiff2) { bdiff2 = cc.ent; bdnum = i; cccell = cc; }
                        }
                    }
                    //console.log(acell.xpos + "," + acell.ypos + ":" + cccell.schar + ":e/15=" + acell.re);
                
                }
                //acell.schar = String.fromCharCode(bdnum+32)
                acell.schar = cccell.schar;
                acell.ochar = cccell.ochar;
                acell.cdri = bdnum;
                acell.ccell = cccell;
                if (acell.ochar) {				
                    text += ((acell.ochar.length>2) ? acell.ochar : htmlEscape(acell.ochar));
                }
            }
                
            
            text+='</p>';
            $('#textout')[0].innerHTML = "<p>" + text;
            text+='<p>';
            
        }
        $('#textout')[0].innerHTML = "<p>" + text;
        
        
    };
    */
    
    // scan colors
    this.colorize = function(thresh) {
        var c, acell, tcell, diff, bdiff,bdnum,i,text,cc, lrgb, llrgb, ls;
        var a,b,d,e;
		var rowlength;
        c = this;
        //filledheight = img.height * (scanvas.width / img.width);
        //c.context.drawImage(img, 0, -c.yoff*(filledheight-scanvas.height), scanvas.width, filledheight); //img.width * 0.3, img.height * 0.3);
        
        if (document.screenmode.name=="c16") {
            thresh=5;
        }
        
        lrgb = new clr(0,0,0);
        llrgb = new clr(0,0,0);
        diff = 0;
        for (cy = 0; cy < this.ychars; cy++) {
            
            row = c.rows[cy];
            llrgb = new clr(-100,-100,-100);
            for (cx = 0; cx < this.xchars; cx++) {
                acell = row[cx];
                diff = Math.abs(acell.rgb.r - lrgb.r) + Math.abs(acell.rgb.g - lrgb.g) + Math.abs(acell.rgb.b - lrgb.b);
                diff = Math.abs(acell.rgb.r - llrgb.r) + Math.abs(acell.rgb.g - llrgb.g) + Math.abs(acell.rgb.b - llrgb.b);
                diff = diff/2;
                //diff += Math.abs(acell.rgb.r  - acell.rgb.g) + Math.abs(acell.rgb.g - acell.rgb.b); // rudimentory eval of color intensity
//				row.push(new Cell(cx, cy, c));

                if (document.screenmode.name=="c16") {
                
					a = acell.rgb; // img cell src
					b = acell.ccell.rgb; // char brightness
					d = subrgb(a,multrgb(a,b)); // white-white=0, remainder kept
					e = addrgb(a,d); // intensify source color by shortfall amount
					acell.avgcolor = e.strong16(); // select c16 color
					acell.gamutcolor = acell.avgcolor;
				
					if ( (((diff > thresh)||(cx==0) )&&(!(acell.schar==" "))&&(!(acell.avgcolor.rgbhex==llrgb.rgbhex)) )||(cx==0)) {
                        llrgb=lrgb;
                        lrgb=acell.avgcolor;
                        
	
                    } else {
                        acell.avgcolor = null;
                    }
                
                } else {
                        
                    if ( (((diff > thresh)||(cx==0) )&&(!(acell.schar==" "))&&(!(acell.rgb.strong.rgbhex==llrgb.rgbhex)) )||(cx==0)) {

                        acell.avgcolor = acell.rgb.strong();
      

                        llrgb=lrgb;
                        lrgb=acell.rgb;
                    
                    } else {
                        acell.avgcolor = null;
                    }
      
                }
            
            }

        }
        text = "";
        
        for (cy = 0; cy < this.ychars; cy++) {

            //text+='<<p>>';
            row = c.rows[cy];
            rowlength = this.xchars;
			for (cx = rowlength-1; cx > 0; cx--) {
                acell = row[cx];
				if (acell.schar==" ") {  // if last character blank
					rowlength--; // knock it off
				} else { cx=0; } // otherwise exit loop
            }
            for (cx = 0; cx < rowlength; cx++) {
                acell = row[cx];
                
                if ((acell.avgcolor != null)) {
                    text += "</span>" + openColor(acell.avgcolor);
                }
                
                text += ((acell.ochar.length>2) ? acell.ochar : htmlEscape(acell.ochar));
            }
            text += '</p><p>';
            
        }
        $('#textout').css(  "font", document.charsize+"px monospace" );
        $('#textout').css(  "line-height", "11px" );
        $('#textout')[0].innerHTML = "<p><span>" + text + "</span>";

    };

    this.renderImgOut = function() { 
        var cont, otxt, cy,y, cx,x,row,acell,text,srgb,c2,scale, bc16;
        scale = document.scale;
        ocanvas = $("#imgout")[0];
        
        ocanvas.width=this.pixwidth*scale;
        ocanvas.height=this.pixheight*scale;

        cont = ocanvas.getContext('2d');
        //ocanvas = $('#imgout')[0];
        cont.font = Math.round(document.charsize*scale)+"px monospace";
        //cont.fillStyle="white";
        cont.fillStyle = document.screenmode.bg;
        cont.fillRect(0,0,ocanvas.width*scale,ocanvas.height*scale); // otherwise 0,0,0 at 0% alpha
        
        
        var clrng, cxr,cyr,lastcol;
        //clrng = Number($("#color")[0].value);
        clrng = Number($("#slcolor").slider("value"));
        //cont.fillStyle = "black";
        cont.fillStyle = document.screenmode.fg;
        bc16 = false;
        if (document.screenmode.name == "c16") { bc16 = true; }
        
        for (cy = 0; cy < this.ychars; cy++) {

            //text+='<<p>>';
            row = this.rows[cy];
            
            for (cx = 0; cx < this.xchars; cx++) {
                acell = row[cx];
                if (clrng>0) {
                    if (bc16) {
                        
                        c2 = acell.gamutcolor; // saved
                        /*if (c2===null) {
                            c2 = lastcol;
                        } else {
                            lastcol = c2;
                        }*/
                    } else {
                        c2 = acell.rgb.strong(); // returns new clr
                    }
                    srgb = c2.rgbhex();
                    cont.fillStyle = srgb;
                } else {
                    cont.fillStyle = document.screenmode.fg;
                }
                //cont.fillStyle = "rgb(" + Math.round(acell.rgb.strong.r) + "," + Math.round(acell.rgb.strong.g) + "," + Math.round(acell.rgb.strong.b) + ")";
                cxr = cx*document.charx*scale;
                cyr = (document.charsize*scale)+(cy*document.chary*scale);
                
                otxt = cont.fillText(acell.schar, cxr, cyr);
                if (scale>=1.7) { // embolden
                otxt = cont.fillText(acell.schar, cxr+1, cyr);
                
                }
                if (scale>=2.1) { // embolden
                otxt = cont.fillText(acell.schar, cxr, cyr+1);
                
                }
                
            }
            //text += '</p><p>';
            
            
            
            
        }
        
        
        
        var img = ocanvas.toDataURL("image/png");
        var oc = $("#imgout");
        oc.hide();
        //$("#iout")[0].src = "";
        $("#iout")[0].src = img;
        $("#iout").width(ocanvas.width/scale);
        $("#iout").height(ocanvas.height/scale);

    }
    
    
    this.goForSize = function(x,y) {
        "use strict";
        var w,h,scanvas,ocanvas;
        
        document.xchars = x;
        document.ychars = y;
        
        
        
        w = x*document.charx; h = y*document.chary;
        
        
        //initScene();
        // 5 X 11 is our char size for the time being
        
            
        document.scn.xchars = x;
        document.scn.ychars = y;
        
        
        scanvas = document.getElementById('splash-container');
        ocanvas = document.getElementById('imgout');
        
        scanvas.width = w;
        scanvas.height = h;
        $('#splash-container').width(w);
        $('#splash-container').height(h);
        
        ocanvas.width = w;
        ocanvas.height = h;
        
        $('#imgout').width(w*document.scale);
        $('#imgout').height(h*document.scale);
        
        
        $('#textout').width(w+80);
        $('#textout').height(h+4);
        
        $('#yoff').height(h);
        $('#yoff').css("margin-left",(w+10)+"px");
        
        this.sizechanged();

    }
    
    
    
    this.initsize = function() {
        "use strict";
        var value, w, h, a;
        
        
        //$( "#setup" ).show();
        $( "#dropzone" ).show();
        
        
        
        
        
        value = $( "#radioset :radio:checked" ).attr('value');
        
        if (value == "x") {
            w = Number($("#wd")[0].value);
            h = Number($("#ht")[0].value);
            if (!isNaN(w) ) {
                
                if (w<10) { return false; }
                if (w>1000) { return false; }
            } else {
                return false;
            }
            if (!isNaN(h) ) {
                
                if (h<3) { return false; }
                if (h>1000) { return false; }
            } else {
                return false;
            }
            
            this.goForSize(w,h);
            
        } else {
        
            a = value.split("x");
            w = Number(a[0]);
            h = Number(a[1]);
            
            this.goForSize(w,h);
        
        }

        return false;
        
    }
}








function initScene(img) {
    if (document.scn===undefined) {
        document.scn = {};
        if (!(img==null)) {
            document.scn.img = img;
        }
        document.scn = new Scene(img);
    } else {
        if (!(img==null)) {
            document.scn.img = img;
        }	
        if (!document.scn.chardatavalid) { document.scn.initChars(); }
        
    }
    
}

function processImage(dfile) {
    var canvas,
    context,
    img,
    filledheight,
    scn;
    
    
    canvas = document.getElementById('splash-container');
    context = canvas.getContext('2d');
    img = document.createElement("img"); //new Image();

    img.onload = function () {

        
        initScene(img);


        document.scn.updateImage();
        
        generate();
            
    };
    
    img.src = window.URL.createObjectURL(dfile); // TODO: might need overload for new FileReader as follows
    
    canvas.onclick = function() {
        generate();
    };

}

function processImageURL(dUrl) {
    var canvas,
    context,
    img,
    filledheight,
    scn;
    
    
    canvas = document.getElementById('splash-container');
    context = canvas.getContext('2d');
    img = document.createElement("img"); //new Image();

    img.onload = function () {
        
        initScene(img);


        document.scn.updateImage();
        
        generate();
            
    };
    
    img.src = dUrl; // TODO: might need overload for new FileReader as follows
        
    canvas.onclick = function() {
        generate();
    };

}
function generate() {

        //document.scn.yoff = 1.0-(Number($("#yoff").slider("value"))/1000.0); // 0-1 scroll factor
        
		setTimeout('$( "#working" ).dialog("open");',80);
		
        initScene();
        
        
        $( "#output" ).show();
        $( "#hello" ).hide(); $( "#asciiart" ).hide();
        
        document.scn.updateImage();
        
        document.scn.quickscan();
        
        document.scn.prescan();
        
		setTimeout('$( "#working" ).dialog("close");',80);

}


// from drag-and-drop

document.getElementById('dropzone').addEventListener("dragover", function (event) {
    event.preventDefault();
}, true);

document.getElementById('dropzone').addEventListener("drop", function (event) {
    event.preventDefault();
    // Ready to do something with the dropped object
    var dfile = event.dataTransfer.files[0];

    if (!dfile.type.match(/image.*/)) {
        alert("This file is not an image.");
    } else {
    
        /*$( "#dropzone" ).hide();
        $( "#setup" ).hide();*/
        
        
        
        $( "#tune" ).show(); /* no use showing until an image is up */
        $( "#preview" ).show();
        $( "#controls" ).show();
        
        
    
        processImage(dfile);
        
    }

}, true);


function markdown() {
    var text,cy,cx,row,acell,c,rowlength;
    c = document.scn;
    
    text = "\n    ";
    
    for (cy = 0; cy < c.ychars; cy++) {

        //text+='<<p>>';
        row = c.rows[cy];
		
		rowlength = c.xchars;
		for (cx = rowlength-1; cx > 0; cx--) {
			acell = row[cx];
			if (acell.schar==" ") {  // if last character blank
				rowlength--; // knock it off
			} else { cx=0; } // otherwise exit loop
		}
		
        for (cx = 0; cx < rowlength; cx++) {
            acell = row[cx];
            
            text += acell.schar; // ((acell.ochar.length>2) ? acell.ochar : htmlEscape(acell.ochar));
        }
        text += '\n    ';
        
    }
    $('#redout').css(  "font", "9px monospace" );
    $('#redout').css(  "line-height", "11px" );
    $('#redout').css(  "whitespace", "pre" );
    $('#redout').text( text + "\n---\nasciiart.club\n" );
}
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function translate() {
    var result, ocanvas, style, hbody, bgc;
    
    document.scn.renderImgOut();
    
    
    $('#htmlout').text( $('#textout').html() );
    
    result	= bbcodeParser.htmlToBBCode( $('#textout').html() );
    result = result.replace("[text]","").replace("[/text]","");
    result = result.replace(new RegExp("&nbsp;", 'gi'),"\u00A0"); // unicode &nbsp;
    $('#bbout').text("[size=9px][font=monospace]"+result+"[/font][/size]");
    $('#charsbbc').text( $('#bbout').text().length );
    
    hbody = $('#textout').html();
    hbody = replaceAll("</p>","<br>",hbody);
    hbody = replaceAll("<p>","",hbody);
	bgc = document.screenmode.bg;
    $('#htmlout').text( '<!DOCTYPE html><head><meta charset="utf-8"></head><body style="font: 9px monospace; line-height:9px; background-color:'+ bgc +';">' + hbody + '</body></html>' );
    
    $('#charshtml').text( $('#htmlout').text().length );
    
    markdown();
    
    
    
}
