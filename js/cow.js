/*
 CoW namespace
 */

(function(cow, undefined) {

    // Private variables

    // Private functions
    var mergeStr = function ( o, n, options ) {
      o = o.replace(/\s+$/, '');
      n = n.replace(/\s+$/, '');
      var defaultOptions = { silent: true, del:{b:'',e:''}, ins:{b:'',e:''} };
      options = options || defaultOptions;

      function escape(s) {
            return s;
      }

      
      var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
      var str = "";

      var oSpace = o.match(/\s+/g);
      if (oSpace == null) {
        oSpace = ["\n"];
      } else {
        oSpace.push("\n");
      }
      var nSpace = n.match(/\s+/g);
      if (nSpace == null) {
        nSpace = ["\n"];
      } else {
        nSpace.push("\n");
      }

      if (out.n.length == 0) {
          for (var i = 0; i < out.o.length; i++) {
            if (!options.silent) str += (options.del.b || defaultOptions.del.b) + escape(out.o[i]) + oSpace[i] + (options.del.e || defaultOptions.del.e);
          }
      } else {
        if (out.n[0].text == null) {
          for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
            if (!options.silent) str += (options.del.b || defaultOptions.del.b) + escape(out.o[n]) + oSpace[n] + (options.del.e || defaultOptions.del.e);
          }
        }

        for ( var i = 0; i < out.n.length; i++ ) {
          if (out.n[i].text == null) {
            str += (options.ins.e || defaultOptions.ins.e) + escape(out.n[i]) + nSpace[i] + (options.ins.e || defaultOptions.ins.e);
          } else {
            var pre = "";

            for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
              if (!options.silent) pre += (options.del.b || defaultOptions.del.b) + escape(out.o[n]) + oSpace[n] + (options.del.e || defaultOptions.del.e);
            }
            str += "" + out.n[i].text + nSpace[i] + pre;
          }
        }
      }
      return str;
    };
    var loadRun = function() {
      console.log("loadRun");

      var dstFrame = document.getElementById('cow-html-render');
      var dstDoc = dstFrame.contentDocument || dstFrame.contentWindow.document;
      dstDoc.write(editor.doc.getValue());
      dstDoc.close();
    };

    
    // Public Variables
    cow.codeMirror = null;
    cow.room = "landing";

    // Public method
    cow.init = function(settings) {
        console.log('Cow init:', settings);
        if (settings.codeMirror)
            cow.codeMirror = settings.codeMirror;

        //
        cow.setup();
    };
    cow.getRoom = function() {
        return cow.room;
    };
    cow.setup = function( ) {

        if (goinstant) {
            var url = 'https://goinstant.net/co-web-dev/cow-dev/'+cow.getRoom();
            goinstant.connect(url, function(err, platform, session) {
                if (err) {
                    console.log('error connecting');
                    return;
                }

                if (cow.codeMirror) {
                    var codeMirror = cow.codeMirror;
                    var codeKey = session.key('/code');

                    var myChange = true;

                    // Update the Code Mirror contents
                    function updateCode(value) {

                        if (codeMirror.getValue() !== value) {
                            var anchor = codeMirror.getCursor(true), head = codeMirror.getCursor(false); // Backup original selection position
                            var value = mergeStr(codeMirror.getValue()||"", value||"");
                            codeMirror.setValue(value); // Set new value / contents
                            codeMirror.setSelection(anchor, head);  // Restore selection position
                            codeMirror.setCursor(head.line, head.ch); // Restore cursor position
                        }
                    };

                    // set the value when we load
                    codeKey.get(function(err, value, context) {
                        updateCode(value);
                    });

                    // handle sets from remote users
                    codeKey.on('set', function(value, context) {
                        myChange = false; 
                        updateCode(value);
                    });
                    
                    // Setup Code Mirror
                    codeMirror.on('change', function(event, instance, changeObj) {
                        console.log("mirror change");
                        loadRun && loadRun();
                        if (myChange) {
                            codeKey.set(codeMirror.getValue());
                        } else {
                            myChange = true;
                        }
                    });
                    
                }
            });
        } else {
            console.log('Error: GoInstant API not installed.');
        }
    };


})(window.cow = window.cow || {});
